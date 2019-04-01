const fs   = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));

const { exec } = require('child_process');

exec_ = (cmd, options) => {
    return new Promise ( (resolve, reject) => { 
        exec(cmd, options, (error, stdout, stderr) => {    
            if (error) {                
                reject({error, stderr})            
            } else {
                resolve(stdout);
            }
        });
    });
}

async function main() {
    console.log(args);

    if ( !args.src || !args.dst ) {
        console.log('Use: node sync --src sourcepath --dst destinationpath')
        return;
    }

    var srcfiles = fs.readdirSync(args.src);
    var dstfiles = fs.readdirSync(args.dst);

    var files = [];

    srcfiles.filter(file=>file.endsWith('.mp4')).forEach(file => {
        if (!dstfiles.find( (dstfile) => file.toLowerCase() == dstfile.toLowerCase() ) )
            files.push(file)    
    });

    console.log('Will Transcode: ' + files.length)

    for(var i = 0; i < files.length; i++) {
        const bin    = path.join(__dirname, '/bin/ffmpeg.exe')
        const input  = path.join(args.src, files[i]);
        const output = path.join(args.dst, files[i])
        const cmd    = `${bin} -i "${input}" -c:v h264 -b:v 4000k -c:a acc -b:a 256k"${output}"`
        console.log(cmd);
        await uticls.exec(cmd, {});
    }
    //ffmpeg -i %1 -c:v h264 -b:v 4000k -c:a aac -b:a 256k %1.mp4
    
}

main();