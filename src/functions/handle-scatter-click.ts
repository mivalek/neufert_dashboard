import { select } from "d3"
import { getFlatGeometry } from "./get-flat-geometry"

export async function handleClick(event: any, setGeomFun: any) {
    const pointData = select(event.target).data() as {id: string}[]
    const id = pointData[0].id                         
    const geom = await getFlatGeometry(id)
    setGeomFun(geom)
}