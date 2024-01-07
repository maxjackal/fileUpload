import { Component } from '@angular/core';
import { MIME_TYPE_MAP } from '../../models/mime-types';
import { CommonModule } from '@angular/common';
import { environment } from '../../environment/environments';
import { pathExistsSync } from 'path-exists';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
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
    if (this.selectedFile==undefined) return;
      let fileType = this.selectedFile.type;
      let fileExtension = MIME_TYPE_MAP[fileType];
      if (!fileExtension) {
        console.error('Desteklenmeyen dosya türü!');
        return;
      }
      
      let date= new Date();
       let dateStr=date.getFullYear()+'-'+(date.getMonth()+1);
      // Dosyayı kaydetmek için fs modülünü kullanın (Node.js tarafında çalışmalıdır).
      if(!pathExistsSync(dateStr)){
        console.log("Tarih dosyası yok");
        createDirectory(environment.assetsDirectory,dateStr).then(res=>{
          this.checkTypeFolder(dateStr,fileType);
        })
        return;
      }
      this.checkTypeFolder(dateStr,fileType);

    
  }
  checkTypeFolder(dateStr:string,fileType:string){
    if(!pathExistsSync(environment.assetsDirectory+'\\'+(fileType.split('/')[0]))){
      console.log("Tip dosyası yok");
      createDirectory(environment.assetsDirectory,(fileType.split('/')[0])).then(x=>{
        this.uploadImage(dateStr,fileType);
      })
      return;

    }
    this.uploadImage(dateStr,fileType);
  }
  uploadImage(date:string,type:string){
    if(this.selectedFile==undefined) return;
      // Dosya içeriğini okuyoz
      var reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        
        let base64Data = reader.result as string;
        saveAs(base64Data,(environment.assetsDirectory+'\\'+date+"\\"+this.selectedFile?.name))
      };
  }
}

interface Window {
  requestFileSystem?: (
      dirName:string,
      type: number,
      size: number,
      successCallback: (fs: FileSystem) => void,
      errorCallback: (error: any) => void
  ) => void;
}

globalThis.requestFileSystem = globalThis.requestFileSystem || globalThis.webkitRequestFileSystem;

async function createDirectory(dirName:any,folderName:string) {
  try {
      const directoryHandle = await globalThis.showDirectoryPicker();
      const newDirectoryHandle = await directoryHandle.getDirectoryHandle(folderName, { create: true });
      
      // Directory created successfully
      console.log('Directory created successfully:', newDirectoryHandle.name);
  } catch (error) {
      console.error('Error:', error);
  }
  return true;
}
