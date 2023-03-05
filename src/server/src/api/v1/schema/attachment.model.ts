import { Column, DataType, Index, Model, Table } from 'sequelize-typescript';

import { Article } from './article.model';
import { Interaction } from './interaction.model';
import { Media } from './media.model';
import { Outlet } from './outlet.model';
import { ResourceType } from './types';
import { Source } from './source.model';

type AttachmentAttributes = {
  resourceType: ResourceType;
  resourceId: number;
  attachmentType: ResourceType;
  attachmentId: number;
  role?: string;
};

type AttachmentCreationAttributes = AttachmentAttributes;

@Table({
  modelName: 'attachment',
  timestamps: true,
  paranoid: true,
})
export class Attachment extends Model<AttachmentAttributes, AttachmentCreationAttributes> {
  @Index({ name: 'attachment_resourceType_resourceId_attachmentType_attachmentId', unique: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    resourceType: ResourceType;

  @Index({ name: 'attachment_resourceType_resourceId_attachmentType_attachmentId', unique: true })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    resourceId: number;

  @Index({ name: 'attachment_resourceType_resourceId_attachmentType_attachmentId', unique: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    attachmentType: ResourceType;

  @Index({ name: 'attachment_resourceType_resourceId_attachmentType_attachmentId', unique: true })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    attachmentId: number;

  @Column({
    type: DataType.STRING,
  })
    role?: string;

  get resource() {
    switch (this.resourceType) {
    case 'article':
      return Article.findByPk(this.resourceId);
    case 'interaction':
      return Interaction.findByPk(this.resourceId);
    case 'media':
      return Media.findByPk(this.resourceId);
    case 'outlet':
      return Outlet.findByPk(this.resourceId);
    case 'source':
      return Source.findByPk(this.resourceId);
    }
  }

  get attachment() {
    switch (this.attachmentType) {
    case 'article':
      return Article.findByPk(this.attachmentId);
    case 'interaction':
      return Interaction.findByPk(this.attachmentId);
    case 'media':
      return Media.findByPk(this.attachmentId);
    case 'outlet':
      return Outlet.findByPk(this.attachmentId);
    case 'source':
      return Source.findByPk(this.attachmentId);
    }
  }
}
