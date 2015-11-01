function downloadDebug(...args){
    if(Images.downloadDebug)
        console.log.apply(console,args);
}

class Downloader{
    constructor(mgr){
        this._mgr = mgr;
        this._fileTransfer = new FileTransfer();
    }
    download(uri,target,successCB,failCB){
        this._mgr.append({
            downloader:this,
            uri:uri,
            target:target,
            success:successCB,
            fail:failCB
        });
    }
}

class DownloadManager{
    constructor(max=1){
        this._maxDownloads = max;
        this._downloadings = [];
        this._pendings = [];
    }
    requestDownloader(){
        var downloader = new Downloader(this);
        return downloader;
    }
    _pushDownloading(job){
        this._downloadings.push(job);
    }
    _removeDownloading(job){
        downloadDebug("download done:",job.uri);
        this._downloadings.splice(this._downloadings.indexOf(job),1);

        while(this._pendings.length>0 && this._downloadings.length<this._maxDownloads) {
            var now = new Date();
            var job = this._pendings.pop();
            downloadDebug("pending time:", (now.getTime() - job.pendingAt.getTime())/1000,'S');
            this._startDownloading(job);
        }
    }
    _startDownloading(job){
        downloadDebug("download starting:",job.uri);

        var self = this;
        this._pushDownloading(job);
        job.downloadingAt = new Date();
        job.downloader._fileTransfer.download(job.uri,job.target,function(entry){
            entry.file(function(blob){
                var now = new Date();
                var span = (now.getTime()-job.downloadingAt.getTime())/1000;
                downloadDebug("speed:",parseInt(blob.size/1024/span),'K/S');
                self._removeDownloading(job);
                job.success({
                    cachedURI:entry.toURL(),
                    size:   blob.size
                });
            },failCB);
        },failCB);

        function failCB(err){
            downloadDebug("download fail:",job.uri);
            self._removeDownloading(job);
            job.fail(err);
        }
    }
    append(job){
        var self = this;
        if(this._downloadings.length<this._maxDownloads){
            this._startDownloading(job);
        }else{
            downloadDebug("download pending:",job.uri);
            job.pendingAt = new Date();
            this._pendings.push(job);
        }
    }
}

Images.downloadManager = new DownloadManager();