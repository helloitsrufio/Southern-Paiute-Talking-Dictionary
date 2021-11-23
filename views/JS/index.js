const form = document.querySelector('#submitButton')

form.addEventListener("click", (e) => {
    e.preventDefault();
})

const files = document.querySelector('form').files
const formData = new FormData()

for(let i = 0; i < files.length; i++) {
    let file = files[i]
    formData.append('file', file)
    // formData.append('upload_preset', 'docs_upload_example_us_preset')
}

fetch(url, {
    method: 'POST',
    body: formData
})
    .then((res) =>{
        return res.text()
    })
    .then((data) =>{
        document.getElementById('data').innerHTML += data
    })
    .catch((err) => console.error('404: not found'))

    //need a signature? not sure what that is or if I actually do need it. see https://cloudinary.com/documentation/upload_images#example_1_upload_multiple_files_using_a_form_unsigned