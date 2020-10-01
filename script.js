$(function() {
   
    var mainImg;
    
    var shouldFaceUser = false;
    var defaultsOpts = { 
        audio: false,
        video: true 
    };

    $('#getDocumentsPage').addClass('hide');

    function capture() {
        let videoElm = document.getElementById('video');
        defaultsOpts.video = { facingMode: shouldFaceUser ? 'user':'environment' }
        navigator.mediaDevices.getUserMedia(defaultsOpts)
        .then(function(_stream) {
            stream  = _stream;
            videoElm.srcObject = stream;
            videoElm.play();
        })
        .catch(function(err) {
            console.log("error->", err);
        });
    }

    function downloadImage(data, filename = 'untitled.jpeg') {
        var a = document.createElement('a');
        a.href = data;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    }

    $('#download-pdf').on('click', function(event) {
        event.preventDefault();
        var doc = new jsPDF();
        var image = mainImg.src;
        doc.addImage(image, 'JPEG', 15, 40, 180, 160);
        doc.save('Document');
    });

    $('#download-jpeg').on('click', function(event) {
        event.preventDefault();
        downloadImage(mainImg.src, 'canvas.jpeg');
    });

    $('#scan-documents').on('click', function(event) {
        event.preventDefault();
        $('#download-pdf').addClass('hide');
        $('#download-jpeg').addClass('hide');
        $('#getDocumentsPage').addClass('hide');
        $('#homePage').addClass('hide');
        var video = document.getElementById('video');
        $('#camScannerPage').removeClass('hide');
        $('#candidate-details-form').addClass('hide');
        $('#canvas').addClass('hide');
        $('#re-scan').addClass('hide');
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    //video.src = window.URL.createObjectURL(stream);
                    video.srcObject = stream;
                    //console.log("src object"+video.srcObject)	
                   // console.log("video", video)						
                    // video.get(0).play();
                    video.play();
                })
                .catch(function(err) {
                    console.log("An error occurred: " + err);
                });
        }
    });

    $('#snap-photo').on("click", function(event) {
        event.preventDefault();
        var video = document.getElementById('video');
        var canvas = document.getElementById('canvas');
        //console.log("Canvas"+canvas.toBlob());
        var context = canvas.getContext('2d');

        context.drawImage(video, 0, 0, 720, 720);
        canvas.style.display="block";


        $('#download-pdf').removeClass('hide');
        $('#download-jpeg').removeClass('hide');
        $('#candidate-details-form').removeClass('hide');

        $('#video').addClass('hide');
        $('#canvas').removeClass('hide');
        $('#re-scan').removeClass('hide');
        mainImg = document.createElement("img");
        mainImg.src = canvas.toDataURL('image/jpeg', 1.0);

        $('#download-pdf').removeClass('hide');
        $('#download-jpeg').removeClass('hide');

        //console.log("before src"+mainImg.src);
        //console.log("img src 2"+mainImg.src);
    });

    $('#submit-candidate').on("click", function(event) {
        event.preventDefault();

        var docName = document.getElementById('document-name').value; //$('#candidate-name').value;
        var cName = document.getElementById('candidate-name').value; //$('#candidate-email').value;
        var cEmail = document.getElementById('candidate-email').value; //$('#document-name').value;
        var jsonObj = { 
            emailId: cEmail,
            candidateName:cName,
            documentName: docName,
            image: mainImg.src
        };
        
        var dataToSend = JSON.stringify(jsonObj);
       // console.log("jsonObj", jsonObj)
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 201) {
                //alert(this.responseText);
                alert('Document Inserted Sucessfully...!')
            }
            
        };
        xhttp.open("POST", "http://3.20.222.19:8080/candidateDocument", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(dataToSend);
    });
      
    $('#get-data-email').on("click", function(event) {
        event.preventDefault();
        var email = $('#email-address').val();
        //candidate-details-data

        $('#candidate-details-data').html('');
        
        var url = "http://3.20.222.19:8080/candidateDocument/search/emailId?emailId=" + email;
        var count = 0;
        var caDocs = [];
       // var candData = []
        
        var jsonObj = { 
            emailId: email
        };
        var dataToSend = JSON.stringify(jsonObj);
       // console.log("JSON "+ dataToSend);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {			 
                //alert(this.responseText);
                var resJSON = this.responseText;
                var opDats = JSON.parse(resJSON);	
                var eData= opDats['_embedded'];
                var candData = eData['candidateDocument'];
               //  candData = eData['candidateDocument'];
                for(i in candData){
                    caDocs[count] = {};
                    caDocs[count] = candData[i];
                    // document.getElementById('candidate-details-data').innerHTML += "</br><h4 style = color:#ff6347>Candidate Name:&nbsp&nbsp</h4><h4>" + candData[i].candidateName + "</h4></br>"+"<br><h4 style = color:#ff6347>Document Name:&nbsp&nbsp</h4><h4>"+candData[i].documentName + "</h4>"+"</br></br> <img src=" + "'" + candData[i].image + "'" + "style="+ "width:600px;height:600px" + ">" + "</br>";
                     document.getElementById('candidate-details-data').innerHTML += "<h4><span style = color:#ff6347>Candidate Name:</span>&nbsp&nbsp" + candData[i].candidateName +"</hr><h4><span style = color:#ff6347>Document Name:</span>&nbsp&nbsp"+candData[i].documentName + "</h4>"+ "<img src=" + "'" + candData[i].image + "'" + "style="+ "width:600px;height:600px;padding:1rem" + ">" + "</br>";
                }			 			
            }
        };
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(dataToSend);
    });

    $('#get-documents').on("click", function(event) {
        event.preventDefault();
        $('#getDocumentsPage').removeClass('hide');
        $('#download-pdf').addClass('hide');
        $('#download-jpeg').addClass('hide');
        $('#homePage').addClass('hide');
    });

    $('#re-scan').on("click", function(event) {
        event.preventDefault();
        $('#video').removeClass('hide');
        $('#canvas').addClass('hide');
        var reVideoId = document.getElementById('video');
        reVideoId.style.display="block";		
        var reCanvasId = document.getElementById('canvas');
        reCanvasId.style.display="none";
        $('#download-pdf').addClass('hide');
        $('#download-jpeg').addClass('hide');
        $('#candidate-details-form').addClass('hide');
    });

    $('#flip-camera').on("click", function(event) {
        event.preventDefault();
        let videoElm = document.getElementById('video');
        // flip button element
        let flipBtn = $('#flip-camera');
        // default user media options
        defaultsOpts = { 
            audio: false,
            video: true 
        };
        // check whether we can use facingMode
        let supports = navigator.mediaDevices.getSupportedConstraints();
        if( supports['facingMode'] === true ) {
            flipBtn.disabled= false;
        }
        if( video.srcObject == null ) return
        video.srcObject.getTracks().forEach(t => {
            t.stop();
        });
        // toggle / flip
        shouldFaceUser = !shouldFaceUser;
        setTimeout(capture, 2000);
    });

    $('.home-btn').on('click', function(event) {
        event.preventDefault();
        window.location.reload();
    });

});