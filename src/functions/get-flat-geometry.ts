// 'use server'
export async function getFlatGeometry(id: string) {    
    if (id === "none") return null
    const rawResp = await fetch('http://localhost:3000/api/geometry/?id=' + id);
    const response = await rawResp.json();
    
    return response.data
}
