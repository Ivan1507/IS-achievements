const del=document.getElementById('delete')

del.onclick=()=>{
    const c=confirm("Вы действительно хотите удалить эту запись?")
    if(!c)
        return false
}

