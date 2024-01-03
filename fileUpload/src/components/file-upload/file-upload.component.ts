
import { Component } from '@angular/core';
import { MIME_TYPE_MAP } from '../../models/mime-types';
import { CommonModule } from '@angular/common';
import { environment } from '../../environment/environments';
import * as fs from 'fs'
import * as path from 'path'
@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  acceptedFileTypes: string;

  constructor() {
    this.acceptedFileTypes = Object.keys(MIME_TYPE_MAP).join(',');
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const fileType = this.selectedFile.type;
      const fileExtension = MIME_TYPE_MAP[fileType];
      console.log(fileType,fileExtension,this.selectedFile,environment.assetsDirectory)

      // Eğer MIME türü bilinmiyorsa ya da desteklenmiyorsa, işlemi durdurabilir veya uyarı verebilirsiniz.
      if (!fileExtension) {
        console.error('Desteklenmeyen dosya türü!');
        return;
      }
      var reader=new FileReader()
      reader.readAsDataURL(this.selectedFile);
      reader.onload=()=>{
        console.log(reader.result)
        //yazma işlemi
      }


    }
  }
}

