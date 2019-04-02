const fs   = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));

const { spawn } = require('child_process');

spawn_ = (cmd, parameters) => {
    return new Promise( (resolve, reject) => {
        const process = spawn(cmd, parameters) 
        /*
        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
    
        process.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
        */
        process.on('close', (code) => {
            if (code == 0)
                resolve();
            reject();
        });
    });   
}

async function main() {
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

    for(var i = 0; i < files.length; i++) {
        const bin    = path.join(__dirname, '/bin/ffmpeg.exe')
        const input  = path.join(args.src, files[i]);        
        const output = path.join(args.dst, files[i]);

        var temp_  = path.parse(output);        
        temp_.base = '_' + temp_.base;
        const temp = path.format(temp_) ;

        const cmd    = `${bin} -i "${input}" -c:v h264 -b:v 4000k -c:a aac -b:a 256k "${temp}"`
        const params = [
            '-y', 
            '-i', input, 
            '-c:v', 'h264', 
            '-b:v', '4000k', 
            '-c:a', 'aac', 
            '-b:a', '256k', 
            temp
        ];

        console.log(`Processing: ${i+1}/${files.length} "${files[i]}" => "${output}"`);
        try {
            await spawn_(bin, params)
            console.log('COMPLETED !')
            //await exec_(cmd, {});
            fs.renameSync(temp, output);
        } catch(e) {
            console.log(e);
        }
    }    
}

main();