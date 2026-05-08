import { PermissionType } from "@/lib/permissions";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...\n");

  // Limpar permissões antigas
  await prisma.user.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.client.deleteMany();
  await prisma.barber.deleteMany();
  await prisma.permission.deleteMany();

  console.log("🗑️  Permissões antigas removidas");

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash("admin1234", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@barberpro.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@barberpro.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Usuário admin criado:", admin.email);

  // Criar serviços
  const services = [
    {
      name: "Corte Masculino",
      description: "Corte tradicional com máquina e tesoura",
      price: 45,
      duration: 30,
      active: true,
    },
    {
      name: "Barba",
      description: "Barba feita com navalha e toalha quente",
      price: 35,
      duration: 20,
      active: true,
    },
    {
      name: "Corte + Barba",
      description: "Combo completo de corte e barba",
      price: 70,
      duration: 50,
      active: true,
    },
    {
      name: "Sobrancelha",
      description: "Design de sobrancelha masculina",
      price: 20,
      duration: 15,
      active: true,
    },
    {
      name: "Pigmentação",
      description: "Pigmentação de barba ou cabelo",
      price: 80,
      duration: 45,
      active: true,
    },
    {
      name: "Hidratação",
      description: "Tratamento capilar com hidratação profunda",
      price: 50,
      duration: 30,
      active: true,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {},
      create: service,
    });
  }

  console.log("✅ Serviços criados");

  // Criar barbeiros
  const barbers = [
    {
      name: "João Silva",
      email: "joao@barberpro.com",
      phone: "(11) 98765-4321",
      specialties: ["Corte Masculino", "Barba"],
      active: true,
    },
    {
      name: "Pedro Santos",
      email: "pedro@barberpro.com",
      phone: "(11) 98765-4322",
      specialties: ["Corte Masculino", "Pigmentação"],
      active: true,
    },
    {
      name: "Carlos Oliveira",
      email: "carlos@barberpro.com",
      phone: "(11) 98765-4323",
      specialties: ["Barba", "Sobrancelha"],
      active: true,
    },
  ];

  const barberUsers = [];

  for (const barber of barbers) {
    const createdBarber = await prisma.barber.upsert({
      where: { email: barber.email },
      update: {},
      create: barber,
    });

    // Criar usuário para o barbeiro
    const barberPassword = await bcrypt.hash("barber1234", 10);
    const barberUser = await prisma.user.upsert({
      where: { email: barber.email },
      update: {},
      create: {
        name: barber.name,
        email: barber.email,
        password: barberPassword,
        role: "BARBER",
        barberId: createdBarber.id,
      },
    });
    barberUsers.push(barberUser);
  }

  console.log("✅ Barbeiros criados");

  // Buscar usuários dos barbeiros para adicionar permissões
  const joaoUser = barberUsers[0];
  const pedroUser = barberUsers[1];
  const carlosUser = barberUsers[2];

  // Dar permissões específicas para cada barbeiro
  if (joaoUser) {
    // João tem acesso completo (menos gerenciar permissões)
    const joaoPermissions = [
      "VIEW_DASHBOARD",
      "MANAGE_APPOINTMENTS",
      "MANAGE_CLIENTS",
      "MANAGE_SERVICES",
      "VIEW_FINANCIAL",
      "VIEW_REPORTS",
    ];

    for (const permission of joaoPermissions) {
      await prisma.permission.upsert({
        where: {
          userId_permission: {
            userId: joaoUser.id,
            permission: permission as any,
          },
        },
        update: {},
        create: {
          userId: joaoUser.id,
          permission: permission as any,
        },
      });
    }
    console.log("✅ Permissões de João Silva:", joaoPermissions.join(", "));
  }

  if (pedroUser) {
    // Pedro tem acesso médio (agenda e clientes)
    const pedroPermissions = [
      "VIEW_DASHBOARD",
      "MANAGE_APPOINTMENTS",
      "MANAGE_CLIENTS",
    ];

    for (const permission of pedroPermissions) {
      await prisma.permission.upsert({
        where: {
          userId_permission: {
            userId: pedroUser.id,
            permission: permission as any,
          },
        },
        update: {},
        create: {
          userId: pedroUser.id,
          permission: permission as any,
        },
      });
    }
    console.log("✅ Permissões de Pedro Santos:", pedroPermissions.join(", "));
  }

  if (carlosUser) {
    // Carlos tem acesso limitado (apenas dashboard)
    const carlosPermissions = ["VIEW_DASHBOARD"] as PermissionType[];

    for (const permission of carlosPermissions) {
      await prisma.permission.upsert({
        where: {
          userId_permission: {
            userId: carlosUser.id,
            permission: permission,
          },
        },
        update: {},
        create: {
          userId: carlosUser.id,
          permission: permission,
        },
      });
    }
    console.log(
      "✅ Permissões de Carlos Oliveira:",
      carlosPermissions.join(", "),
    );
  }

  console.log("");

  // Criar alguns clientes de exemplo
  const clients = [
    {
      name: "Maria Silva",
      email: "maria@example.com",
      phone: "(11) 91234-5678",
      totalVisits: 5,
      totalSpent: 225,
    },
    {
      name: "José Santos",
      email: "jose@example.com",
      phone: "(11) 91234-5679",
      totalVisits: 3,
      totalSpent: 135,
    },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { phone: client.phone },
      update: {},
      create: client,
    });
  }

  console.log("✅ Clientes criados");

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Seed concluído com sucesso!");
  console.log("=".repeat(60));
  console.log("\n📝 CREDENCIAIS DE ACESSO:\n");
  console.log("👑 ADMIN (Acesso Total):");
  console.log("   Email: admin@barberpro.com");
  console.log("   Senha: admin1234");
  console.log("   Permissões: TODAS\n");
  console.log("👨 BARBEIROS:\n");
  console.log("   1️⃣  João Silva (Acesso Completo)");
  console.log("       Email: joao@barberpro.com");
  console.log("       Senha: barber1234");
  console.log(
    "       Permissões: Dashboard, Agenda, Clientes, Serviços, Financeiro, Relatórios\n",
  );
  console.log("   2️⃣  Pedro Santos (Acesso Médio)");
  console.log("       Email: pedro@barberpro.com");
  console.log("       Senha: barber1234");
  console.log("       Permissões: Dashboard, Agenda, Clientes\n");
  console.log("   3️⃣  Carlos Oliveira (Acesso Limitado)");
  console.log("       Email: carlos@barberpro.com");
  console.log("       Senha: barber1234");
  console.log("       Permissões: Dashboard apenas\n");
  console.log("=".repeat(60));
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
