import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  Default,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";
import bcrypt from "bcryptjs";

@Table({ tableName: "users" })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column({ allowNull: false, unique: true })
  email!: string;

  @Column({ allowNull: false })
  password!: string;

  @Column({ allowNull: false })
  name!: string;

  @Default(false)
  @Column
  is_verified!: boolean;

  @Column(DataType.STRING)
  reset_password_token?: string;

  @Column(DataType.DATE)
  reset_password_expires_at?: Date;

  @Column(DataType.STRING)
  verification_token?: string;

  @Column(DataType.DATE)
  verification_expires_at?: Date;

  @Default(false)
  @Column
  is_admin!: boolean;

  @Column(DataType.DATE)
  last_login?: Date;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;

  // Hooks to hash password before saving
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  // Method to compare password
  async isValidPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
