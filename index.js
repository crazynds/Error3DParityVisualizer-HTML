
Vue.createApp({
    data() {
        return {
            message: 'Hello Vue!',
            matiz_size: 5,
            data: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
            matriz: null,
            matriz_recebida:null,
            show_z: null,
        }
    },
    methods:{
        listTomatriz(list, elementsPerSubArray) {
            var matriz = [], listIndex=0,line=0,column=0,z=0;
            const chunkData = elementsPerSubArray*elementsPerSubArray*elementsPerSubArray -(3*elementsPerSubArray)+2;
            do{
                if(matriz[z]==undefined){
                    matriz[z] = [];
                }
                if(matriz[z][column]==undefined){
                    matriz[z][column] = [];
                }
                if(matriz[z][column][line]==undefined){
                    matriz[z][column][line] = [];
                }
                const verfic = (z==0 && line==0) 
                    || (z==0 && column==0)
                    || (line==0 && column==0)
                    
                matriz[z][column][line++] = verfic? 0 : list[listIndex];
                if(!verfic){
                    listIndex++;
                }

                if(line>=elementsPerSubArray){
                    line = 0;
                    column++;
                }
                if(column>=elementsPerSubArray){
                    column = 0;
                    z++;
                }
                if(z>elementsPerSubArray){
                    z=0;
                }
            }while(listIndex<chunkData);
                
            return matriz;
        },
        sendMatriz(matriz){
            let newMat = JSON.parse(JSON.stringify(matriz));
            const maxErrors = Math.round(Math.random() * 10) - 3; 
            for(let erro = 0;erro < maxErrors;erro++){
                const z = Math.ceil(Math.random() * matriz.length)-1
                const l = Math.ceil(Math.random() * matriz.length)-1
                const c = Math.ceil(Math.random() * matriz.length)-1
                newMat[z][l][c]= 0**newMat[z][l][c];
            }
            console.log((maxErrors>0?maxErrors:0)+ ' erros')
            this.matriz_recebida = newMat;
        },
        preparematriz(){
            const matriz_size = this.matiz_size;
            const chunkData = matriz_size*matriz_size*matriz_size -(3*matriz_size)+2;
            if(this.data.length<chunkData){
                this.data = this.randomArray(chunkData,1);
            }
            this.matriz = this.listTomatriz(this.data,matriz_size);
            this.data.splice(0,chunkData);
            console.log(this.matriz);
            this.show_z = matriz_size;
            console.log(this.show_z);
        },
        updateShow(num){
            const nVal = this.show_z+num;
            if(nVal<=0)return false;
            if(nVal>this.matiz_size)return false;
            this.show_z=nVal;
        },
        randomArray(length, max) {
            return Array.apply(null, Array(length)).map(function() {
                return Math.round(Math.random() * max);
            });
        },
        checkParity(matriz,z,l,c){
            let paritySquare = 0;
            if(z==l && l==c && c==0){
                for(let aux =1; aux<matriz.length;aux++){
                    paritySquare^= matriz[aux][0][0];
                    paritySquare^= matriz[0][aux][0];
                    paritySquare^= matriz[0][0][aux];
                }
            }else if(z==l && l==0){
                for(let x =0; x<matriz.length;x++){
                    for(let y=0;y<matriz.length;y++){
                        if(x==y && x==0)continue;
                        paritySquare^= matriz[x][y][c];
                    }
                }
            }else if(z==c && c==0){
                for(let x =0; x<matriz.length;x++){
                    for(let y=0;y<matriz.length;y++){
                        if(x==y && x==0)continue;
                        paritySquare^= matriz[x][l][y];
                    }
                }
            }else if(l==c && c==0){
                for(let x =0; x<matriz.length;x++){
                    for(let y=0;y<matriz.length;y++){
                        if(x==y && x==0)continue;
                        paritySquare^= matriz[z][x][y];
                    }
                }
            }else return false;
            return paritySquare==matriz[z][l][c]
        },
        canCorrige(matriz){
            let erros= 0;
            let top = false, right= false, left = false;
            for(let z=0;z<matriz.length;z++){
                for(let l=0;l<matriz.length;l++){
                    for(let c=0;c<matriz.length;c++){
                        if((z==0?0:z/z) + (l==0?0:l/l)+(c==0?0:c/c)<=1){
                            const parity = this.checkParity(matriz,z,l,c);
                            if(!parity){
                                if(z==l && l==c && c==0)
                                    return false;
                                if(z==l && l==0)
                                    right= true;
                                if(z==c && c==0)
                                    left= true;
                                if(l==c && c==0)
                                    top= true;
                                erros++;
                                if(erros>matriz.length)return false;
                            }
                        }
                    }
                }
            }
            if(erros>0)return top && left && right;
            return true;
        }
    },
    computed:{
        matrizParity(){
            if(this.matriz == null)return [];
            let line,column,z;
            let size = this.matriz.length;
            let globalParity = 0;
            let newMat = JSON.parse(JSON.stringify(this.matriz));

            for(line=1;line<size;line++){
                let paritySquare = 0;
                for(column=0;column<size;column++){
                    for(z=0;z<size;z++){
                        paritySquare^=this.matriz[z][line][column];
                    }
                }
                newMat[0][line][0] = paritySquare;
                globalParity^=paritySquare;
            }
            for(column=1;column<size;column++){
                let paritySquare = 0;
                for(line=0;line<size;line++){
                    for(z=0;z<size;z++){
                        paritySquare^=this.matriz[z][line][column];
                    }
                }
                newMat[0][0][column] = paritySquare;
                globalParity^=paritySquare;
            }
            for(z=1;z<size;z++){
                let paritySquare = 0;
                for(column=0;column<size;column++){
                    for(line=0;line<size;line++){
                        paritySquare^=this.matriz[z][line][column];
                    }
                }
                newMat[z][0][0] = paritySquare;
                globalParity^=paritySquare;
            }
            newMat[0][0][0] = globalParity;
            return newMat;
        }
    }
}).mount('#app')