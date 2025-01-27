import {useEffect, useState} from 'react';
import { supabase } from '../../Client.jsx';
import './Images.css';
export default function Images ({ name, url, size, onUpload}) {
    const [imageUrl, setImageUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if(url) downloadImage(url)
    }, [url])

    async function downloadImage(path) {
        try {
            const {data, error} = await supabase.storage
            .from('images')
            .download(path)
            if(error) {
                throw error
            }
            const url = URL.createObjectURL(data)
            setImageUrl(url)
        } catch (error) {
            console.log('Error downloading image: ', error.message)
        }
    }

    async function uploadImage(event) {
        try {
            setUploading(true)

            if(!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            let {error: uploadError} = await supabase.storage.from('images').upload(filePath, file)
            
            if(uploadError) {
                throw uploadError
            }

            onUpload(event, filePath)
        } catch (error) {
            alert(error.message)

        } finally {
            setUploading(false)
        }
    }


    return (
        <div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="image"
              className="post image"
              style={{ maxWidth: "30%",}}
            />
          ) : (
            <div className="post no-image" style={{ height: size, width: size }} />
          )}
          <div style={{ width: size }}>
            <label className="button primary block" htmlFor="single">
              {uploading ? 'Uploading ...' : 'Upload'}
            </label>
            <input
              style={{
                visibility: 'hidden',
                position: 'absolute',
              }}
              type="file"
              id="single"
              accept="image/*"
              onChange={uploadImage}
              disabled={uploading}
            />
          </div>
        </div>
      )
    }