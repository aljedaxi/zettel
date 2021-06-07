const files = await fs.readdir('./').then(xs => xs.filter (s => !s.includes('fuck-lol')))
await Promise.all(files.map(fileName => $`sed -i .bak 's/######/        -/' ${fileName}`))
await Promise.all(files.map(fileName => $`sed -i .bak 's/#####/      -/' ${fileName}`))
await Promise.all(files.map(fileName => $`sed -i .bak 's/####/    -/' ${fileName}`))
await Promise.all(files.map(fileName => $`sed -i .bak 's/###/  -/' ${fileName}`))
await Promise.all(files.map(fileName => $`sed -i .bak 's/##/-/' ${fileName}`))
await $`rm *.bak`
