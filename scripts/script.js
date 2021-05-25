const adds=document.getElementsByName('addtoPart')
const part_id=document.getElementById('part_id')
for(let i=0;i<adds.length;i++){
    adds[i].onclick=()=>{
        part_id.value=adds[i].attributes.value.value
    }
}

