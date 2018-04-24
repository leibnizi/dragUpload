import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import './App.css';

const CLOUDINARY_UPLOAD_PRESET = 'bmzjbxoq';
const CLOUDINARY_UPLOAD_URL = 'http://api.v2.msparis.com/common/upload';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFile: null,
      uploadedFileCloudinaryUrl: []
    };
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                     .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState((prevState)=>({
          uploadedFileCloudinaryUrl: prevState.uploadedFileCloudinaryUrl+','+response.body.data[0].url
        }))
      }
    });
  }

  render() {
    const { uploadedFileCloudinaryUrl } = this.state
    return (
      <form>
        <div className="FileUpload">
          <Dropzone
            onDrop={this.onImageDrop.bind(this)}
            multiple={true}
            accept="image/*"
          >
            <div>Drop an image or click to select a file to upload.</div>
          </Dropzone>
        </div>

        <div>
          {
            this.state.uploadedFileCloudinaryUrl.length===0 ? null :
            <div>
              {
                uploadedFileCloudinaryUrl.split(',').map((item,index)=>{
                  return (
                    <img key={index} src={item} />
                  )
                })
              }
            </div>
          }
        </div>
      </form>
    )
  }
}
