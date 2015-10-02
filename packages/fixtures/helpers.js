TestStorageService = {
    directiveMatch:{

    },
    directiveDefault:{

    },
    upload: function (method, directive, file, meta){
        return {
            upload: "file://~/uploads",
            download:"file://~/uploads"+file.name,
            postData:[

            ],
            headers:{

            }
        };
    },
    maxSize: 50*1024*1024
};

Slingshot.fileRestrictions("testUploads",{
    allowedFileTypes:["image/png","image/jpeg","image/gif"],
    maxSize: 5*1024*1024
});