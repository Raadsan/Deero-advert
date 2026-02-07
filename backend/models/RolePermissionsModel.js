import mongoose from "mongoose";

const RolePermissionsSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      unique: true,
      index: true,
    },

    menusAccess: [
      {
        menuId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },

        subMenus: [
          {
            subMenuId: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("RolePermissions", RolePermissionsSchema);
