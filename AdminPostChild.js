function upload(){
    //get your image
    var image=document.getElementById('image').files[0];
    //get your input value
    var pays=document.getElementById('pays').value;
    var age=document.getElementById('age').value;
    var date_naissance=document.getElementById('date_naissance').value;
    var message=document.getElementById('message').value;
    var CountValue=document.getElementById('counterID');

    //get image name
    

    if(pays==""){
        alert("svp entrez le pays");
        return;
    }if(age==""){
        alert("svp entrez l'age");
        return;
    }
    if(date_naissance==""){
        alert("svp entrez la date de naissance");
        return;
    }
    if(message==""){
        alert("svp entrez le message");
        return;
    }
    if(image==null){
        alert("svp selectionnez l'image");
        return;
    }
    var imageName=image.name;
    //firebase storage reference
    
    //it is the path where your image will be stored
    var storageRef=firebase.storage().ref('PostedChildImage/'+imageName);
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
           firebase.database().ref('PostedChild/').push().set({
                 pays:pays,
                 age:age,
                 date_naissance:date_naissance, 
                 message:message,
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

window.onload=function(){
    this.getdata();
}


function getdata(){
    firebase.database().ref('/').once('value').then(function(snapshot){
      //get your posts div
      var posts_div=document.getElementById('posts');
      //remove all remaining data in that div
      posts_div.innerHTML="";
      //get data from firebase
      var data=snapshot.val();
      console.log(data);
      //now pass this data to our posts div
      //we have to pass our data to for loop to get one by one
      //we are passing the key of that post to delete it from database
      for(let[key,value] of Object.entries(data)){
        posts_div.innerHTML="<div class='col-sm-4 mt-2 mb-1'>"+
        "<div class='card'>"+
        "<img src='"+value.imageURL+"' style='height:250px;'>"+
        "<div class='card-body'><p class='card-text'>"+value.text+"</p>"+
        "<button class='btn btn-danger' id='"+key+"' onclick='delete_post(this.id)'>Delete</button>"+
        "</div></div></div>"+posts_div.innerHTML;
      }
    
    });
}

function delete_post(key){
    firebase.database().ref('blogs/'+key).remove();
    getdata();

}