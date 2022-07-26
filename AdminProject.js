function upload(){
    //get your image
    var image=document.getElementById('image').files[0];
    //get your input value
    var titre=document.getElementById('titre').value;
    var detail=document.getElementById('detail').value;
    var CountValue=document.getElementById('counterID');

    //get image name
    

    if(titre==""){
        alert("svp entrez le titre");
        return;
    }if(detail==""){
        alert("svp entrez les details");
        return;
    }
   
    if(image==null){
        alert("svp selectionnez l'image");
        return;
    }
    var imageName=image.name;
    //firebase storage reference
    
    //it is the path where your image will be stored
    var storageRef=firebase.storage().ref('ProjetImage/'+imageName);
    //upload image to selected storage reference
    //make sure you pass image here
    var uploadTask=storageRef.put(image);
    //to get the state of image uploading....
    uploadTask.on('state_changed',function(snapshot){
         //get task progress by following code
         var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
         CountValue.innerHTML=progress +"% uploaded";
         console.log("upload is "+progress+" done");
    },function(error){
      //handle error here
      console.log(error.message);
    },function(){
        //handle successfull upload here..
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
           //get your image download url here and upload it to databse
           //our path where data is stored ...push is used so that every post have unique id
           firebase.database().ref('Projets/').push().set({
                 titre:titre,
                 detail:detail,
                 imageURL:downloadURL
           },function(error){
               if(error){
                   alert("Error while uploading");
               }else{
                   alert("Successfully uploaded");
                   //now reset your form
                   document.getElementById('post-form').reset();
                   getdata();
               }
           });
        });
    });

}

function delete_post(key){
    firebase.database().ref('blogs/'+key).remove();
    getdata();

}