// import connectDB from "./config/db.js";
// import User from "./models/UserModel.js";
// import Role from "./models/roleModel.js";
// import Menu from "./models/menuModel.js";
// import RolePermissions from "./models/RolePermissionsModel.js";
// import bcrypt from "bcrypt";
// import dotenv from "dotenv";

// dotenv.config();

// const seedAdmin = async () => {
//   try {
//     await connectDB();
//     console.log("Database connected. Starting seed...");

//     // 1. Create or find Menus
//     const menuTitles = ["Dashboard", "Managements", "Requests", "Configurations"];
//     const menuIds = [];

//     for (const title of menuTitles) {
//       let menu = await Menu.findOne({ title });
      
//       const configSubMenus = [
//         { title: "Role", url: "/configuration/roles" },
//         { title: "Menu", url: "/configuration/menus" },
//         { title: "Role Permission", url: "/configuration/role-permissions" }
//       ];

//       if (!menu) {
//          let subMenus = [];
//          if (title === "Configurations") {
//            subMenus = configSubMenus;
//          }
//          menu = await Menu.create({ title, isCollapsible: true, subMenus });
//          console.log(`Created menu: ${title}`);
//       } else {
//          if (title === "Configurations") {
//             let changed = false;
//             for (const rsm of configSubMenus) {
//                const existingSubMenu = menu.subMenus.find(sm => sm.title === rsm.title);
//                if (!existingSubMenu) {
//                   menu.subMenus.push(rsm);
//                   changed = true;
//                } else if (existingSubMenu.url !== rsm.url) {
//                   existingSubMenu.url = rsm.url;
//                   changed = true;
//                }
//             }
//             if (changed) {
//                await menu.save();
//                console.log("Updated Configurations menu with submenus");
//             }
//          }
//          console.log(`Menu exists: ${title}`);
//       }
//       menuIds.push(menu._id);
//     }

//     // 2. Create or find Admin Role
//     let role = await Role.findOne({ name: "admin" });
//     if (!role) {
//       let oldRole = await Role.findOne({ name: "Admin" });
//       if (oldRole) {
//          oldRole.name = "admin";
//          await oldRole.save();
//          role = oldRole;
//          console.log("Updated Admin role to lowercase");
//       } else {
//          role = await Role.create({ name: "admin", description: "System Administrator with full access" });
//          console.log("Created Admin role");
//       }
//     } else {
//       console.log("admin role already exists");
//     }

//     // 3. Upsert RolePermissions
//     const menusAccess = [];
//     for (const title of menuTitles) {
//       const menu = await Menu.findOne({ title });
//       if (menu) {
//          menusAccess.push({
//            menuId: menu._id,
//            subMenus: menu.subMenus ? menu.subMenus.map(sm => ({ subMenuId: sm._id })) : []
//          });
//       }
//     }

//     let rolePerm = await RolePermissions.findOne({ role: role._id });
//     if (!rolePerm) {
//       await RolePermissions.create({ role: role._id, menusAccess });
//       console.log("Created Admin RolePermissions");
//     } else {
//       rolePerm.menusAccess = menusAccess;
//       await rolePerm.save();
//       console.log("Updated Admin RolePermissions");
//     }

//     // 4. Create Admin User
//     const email = "admin@deero-advert.com";
//     let adminUser = await User.findOne({ email });
//     if (!adminUser) {
//       const hashedPassword = await bcrypt.hash("password123", 10);
//       adminUser = await User.create({
//         fullname: "System Admin",
//         email,
//         password: hashedPassword,
//         phone: "0000000000",
//         role: role._id
//       });
//       console.log(`Created Admin user: ${email} with password password123`);
//     } else {
//       adminUser.role = role._id;
//       await adminUser.save();
//       console.log("Admin user already exists, ensured role is Admin");
//     }

//     console.log("Seeding completed successfully.");
//     process.exit(0);

//   } catch (error) {
//     console.error("Seeding failed: ", error);
//     process.exit(1);
//   }
// };

// seedAdmin();
