import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient


export const getKonten=async(req, res)=>{
    try {
        const reponse = await prisma.konten.findMany()
        res.status(200).json(reponse)
    } catch (error) {
        res.status(400).json({message:error.message})
        
    }
}
export const getKontenById=async(req, res)=>{
    try {
        const reponse = await prisma.konten.findUnique({
            where:{
                id: Number(req.params.id)
            }
        })
        res.status(200).json(reponse)
    } catch (error) {
        res.status(401).json({message:error.message})
        
    }
}
export const createKonten=async(req, res)=>{
    const {link, deskripsi, platform, createAt}=req.body
    try {
        const reponse = await prisma.konten.create({
             data:{
            link: link,
            deskripsi: deskripsi,
            platform:platform,
            createdAt:createAt

        }
        })
       
        res.status(200).json(reponse)
    } catch (error) {
        res.status(402).json({message:error.message})
    }
}
export const updateKonten=async(req, res)=>{
     const {link, deskripsi, platform,createAt}=req.body
    try {
        const reponse = await prisma.konten.update({
            where:{
                id : Number(req.params.id)
            },
             data:{
                link:link ,
                deskripsi: deskripsi,
                platform:platform,
                createdAt:createAt
        }
        })
        res.status(200).json(reponse)
    } catch (error) {
        res.status(403).json({message:error.message})
    }
}
export const deleteKonten=async(req, res)=>{
     try {
        const reponse = await prisma.konten.delete({
            where:{
                id : Number(req.params.id)
            }
        })
        res.status(200).json(reponse)
    } catch (error) {
        res.status(403).json({message:error.message})
    }
}