import { PrismaClient, RoomStatus, RoomType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
async function main(){
  const pwd = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: { username: "admin", email: "admin@hotel.com", password: pwd }
  });

  const rooms = [
    { roomNumber: "201", type: RoomType.FSKG, price: 1077000, status: RoomStatus.OCCUPIED },
    { roomNumber: "202", type: RoomType.FBK, price: 1377000, status: RoomStatus.VCI },
    { roomNumber: "203", type: RoomType.FBK, price: 1377000, status: RoomStatus.VCI },
    { roomNumber: "205", type: RoomType.FSST, price: 1077000, status: RoomStatus.OCCUPIED },
    { roomNumber: "206", type: RoomType.FBK, price: 1377000, status: RoomStatus.VCI },
    { roomNumber: "207", type: RoomType.DXQ, price: 877000, status: RoomStatus.OCCUPIED },
    { roomNumber: "208", type: RoomType.DXQ, price: 877000, status: RoomStatus.VCN },
    { roomNumber: "209", type: RoomType.FSKG, price: 1077000, status: RoomStatus.VCI },
    { roomNumber: "210", type: RoomType.FSKG, price: 1077000, status: RoomStatus.VCI },
    { roomNumber: "211", type: RoomType.FSKG, price: 1077000, status: RoomStatus.VCI },
    { roomNumber: "212", type: RoomType.FSKG, price: 1077000, status: RoomStatus.VDN },
    { roomNumber: "215", type: RoomType.FSST, price: 1077000, status: RoomStatus.VCI },

    { roomNumber: "301", type: RoomType.FSKG, price: 1077000, status: RoomStatus.VCI },
    { roomNumber: "302", type: RoomType.FBK, price: 1377000, status: RoomStatus.VCI },
    { roomNumber: "303", type: RoomType.FSKG, price: 1077000, status: RoomStatus.VDN },
    { roomNumber: "305", type: RoomType.FBK, price: 1377000, status: RoomStatus.VDN },
    { roomNumber: "306", type: RoomType.FSST, price: 1077000, status: RoomStatus.VCI },
    { roomNumber: "307", type: RoomType.FSST, price: 1077000, status: RoomStatus.VCI },
    { roomNumber: "308", type: RoomType.FSST, price: 1077000, status: RoomStatus.OOO },
    { roomNumber: "309", type: RoomType.FBK, price: 1377000, status: RoomStatus.OOO },
    { roomNumber: "310", type: RoomType.FSKG, price: 1077000, status: RoomStatus.OOO },
    { roomNumber: "311", type: RoomType.FBK, price: 1377000, status: RoomStatus.OOO },
    { roomNumber: "312", type: RoomType.FSKG, price: 1077000, status: RoomStatus.OOO },
    { roomNumber: "315", type: RoomType.FSST, price: 1077000, status: RoomStatus.VCI },
  ];
  for (const r of rooms){
    await prisma.room.upsert({
      where: { roomNumber: r.roomNumber },
      update: {},
      create: r
    });
  }
}
main().finally(()=>prisma.$disconnect());
