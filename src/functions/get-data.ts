
export async function getObsData(id: string) {
    'use server'
    // if (id === "none") return null
    const rawResp = await fetch('http://localhost:3000/api/observation/?id=' + id);
    const response = await rawResp.json();
    
    return response.data
}

export async function getPredData(id: string) {
    'use server'
    // if (id === "none") return null
    const rawResp = await fetch('http://localhost:3000/api/prediction/?id=' + id);
    const response = await rawResp.json();
    
    return response.data
}

export async function getSpiderData(id: string) {
    const pred = await getPredData(id)
    const obs = await getObsData(id)
    
    return [pred, obs]
}