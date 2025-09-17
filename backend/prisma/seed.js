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
    { roomNumber: "101", type: RoomType.BOUTIQUE, price: 1377000, status: RoomStatus.VCI },
    { roomNumber: "102", type: RoomType.BOUTIQUE, price: 1377000, status: RoomStatus.VCN },
    { roomNumber: "201", type: RoomType.SS, price: 1077000, status: RoomStatus.VCI },
    { roomNumber: "202", type: RoomType.SS, price: 1077000, status: RoomStatus.VCN },
    { roomNumber: "301", type: RoomType.DXQ, price: 877000, status: RoomStatus.VCI },
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
