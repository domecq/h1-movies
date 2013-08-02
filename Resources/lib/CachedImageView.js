/* 
    Developed by Kevin L. Hopkins (http://kevin.h-pk-ns.com)
    You may borrow, steal, use this in any way you feel necessary but please
    leave attribution to me as the source.  If you feel especially grateful,
    give me a linkback from your blog, a shoutout @Devneck on Twitter, or 
    my company profile @ http://wearefound.com.

/* Expects parameters of the directory name you wish to save it under, the url of the remote image, 
   and the Image View Object its being assigned to. */

/** commonJS module by Nicolás Peralta */


exports.init = function (imageDirectoryName) {
    this._imageDirectoryName = imageDirectoryName;
    this.w = null;
    this.h = null;
    this.l = null;
    this.t = null;    
    this.osname = Titanium.Platform.osname;
}

exports.setSizeAndPosition = function (w,h,l,t) {
    this.w = w;
    this.h = h;
    this.l = l;
    this.t = t;
}

exports.cache = function(url, imageViewObject, callback, currentWin) {
	Ti.API.log(url);
    // Grab the filename
    var filename = url.split('/');
    Ti.API.log(filename);
    Ti.API.log(this._imageDirectoryName);
    var imageDirectoryName = this._imageDirectoryName;
    var urlHash = Ti.Utils.sha1(url);
    Ti.API.info('urlHash es '+urlHash);
    Ti.API.log(imageDirectoryName);
    

    if (this.osname === 'android') {
        // var loading = Ti.UI.createImageView({
        //     images : [
        //             '/images/loading/00.png', '/images/loading/01.png', '/images/loading/02.png',
        //             '/images/loading/03.png', '/images/loading/04.png', '/images/loading/05.png',
        //             '/images/loading/06.png', '/images/loading/08.png', '/images/loading/09.png',
        //             '/images/loading/10.png', '/images/loading/11.png'
        //         ],
        //         width: '33dp', 
        //         height: '33dp',
        //         top: (this.h/2)-15 + 'dp',
        //         left: (this.w/2)-15 + 'dp'
        // });
        // loading.start();

        // var view = Ti.UI.createView({
        //     top: imageViewObject.top,
        //     left: imageViewObject.left,
        //     width:  this.w + 'dp',
        //     height:  this.h + 'dp',
        //     backgroundColor: 'white',
        //     layout: 'horizontal'
        // });

        // // view.add(loading);    
        // currentWin.add(view);
    }

    filename = filename[filename.length - 1];
    var ext = filename.split('.');
    ext = ext[ext.length - 1];

    //Ti.API.info('filename es '+filename + ' image directory name ' + imageDirectoryName);

    var newname = urlHash+'.'+ext;

    //Ti.API.info('hash es '+newname);

    // Try and get the file that has been previously cached
    var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName, newname);

    Ti.API.log('about to check if file exists');
    if(file.exists()) {
    	Ti.API.log('Exist!');
        // If it has been cached, assign the local asset path to the image view object.
        imageViewObject.image = file.nativePath;        
        if (this.osname === 'android') {
            currentWin.remove(view);
            // view.remove(loading);    
            view = null;
            // loading = null;
        }
        //To release memory
        file = null;
        if(typeof callback !== 'undefined' && callback != null) {
            callback(true);
        }
    } else {
        // If it hasn't been cached, grab the directory it will be stored in.
        var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName);
        if(!g.exists()) {
            // If the directory doesn't exist, make it
            g.createDirectory();
        };

        // Create the HTTP client to download the asset.
        var xhr = Ti.Network.createHTTPClient();

        xhr.onload = function() {
        	Ti.API.log('load');
            if(xhr.status == 200) {
                // On successful load, take that image file we tried to grab before and 
                // save the remote image data to it.
                file.write(xhr.responseData);
                // Assign the local asset path to the image view object.
                if (this.osname === 'android') {
                    currentWin.remove(view);
                    // view.remove(loading);    
                    view = null;
                }
                imageViewObject.image = file.nativePath;
                //To release memory
                file = null;
                if(typeof callback !== 'undefined'  && callback != null ) {
                    callback(true);
                }
            } else {
                callback(false);
            }
        };

        xhr.onerror = function(e) {
            Ti.API.log(e);
        }

        // Issuing a GET request to the remote URL
        if (this.osname === 'android') {
            var left_x = this.l!=null ? (this.w/this.l/100) : 0;
            //Ti.API.log('http://dsin.appspot.com/image/service?img_url=' + url + '&w=' + this.w + '&h=' + this.h + '&left_x=' + left_x + '&top_y=0&right_x=1&bottom_y=1');
            xhr.open('POST', 'http://dsin.appspot.com/image/service?img_url=' + url + '&w=' + this.w + '&h=' + this.h + '&left_x=' + left_x + '&top_y=0&right_x=1&bottom_y=1');
        }
        else {
        	Ti.API.log('calling to ' +url);
            xhr.open('GET', url);
        }
        // Finally, sending the request out.
        xhr.send();
    }

}

var _getExtension = function(fn) {
    // from http://stackoverflow.com/a/680982/292947
    var re = /(?:\.([^.]+))?$/;
    var tmpext = re.exec(fn)[1];
    return (tmpext) ? tmpext : '';
  }

exports.cache_ti = function(a){

    /*

    Usage :

        var image = Utils.RemoteImage({
          image:'http://farm7.staticflickr.com/6059/6262552465_e53bccbd52_z.jpg',
          defaultImage:'KS_nav_ui.png',
          width:300,
          height:200,
          top:20
        });
        win2.add(image);    
    */

    a = a || {};
    var md5;
    var needsToSave = false;
    var savedFile;
    if(a.image){
      md5 = Ti.Utils.md5HexDigest(a.image)+_getExtension(a.image);
      savedFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,md5);
      if(savedFile.exists()){
        a.image = savedFile;
      } else {
        needsToSave = true;
      }
    }
    var image = Ti.UI.createImageView(a);
    if(needsToSave === true){
      function saveImage(e){
        image.removeEventListener('load',saveImage);
        savedFile.write(
          Ti.UI.createImageView({image:image.image,width:'auto',height:'auto'}).toImage()
        );
      }
      image.addEventListener('load',saveImage);
    }
    return image;
}
