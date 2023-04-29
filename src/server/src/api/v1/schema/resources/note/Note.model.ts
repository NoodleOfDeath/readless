import { Table } from 'sequelize-typescript';

import { NoteAttributes, NoteCreationAttributes } from './Note.types';
import { Interaction } from '../../interaction/Interaction.model';
import { InteractionType } from '../../types';
import { Post } from '../Post.model';

@Table({
  modelName: 'note',
  paranoid: true,
  timestamps: true,
})
export class Note<
    I extends Interaction,
    A extends NoteAttributes = NoteAttributes,
    B extends NoteCreationAttributes = NoteCreationAttributes,
  > extends Post<I, A, B> implements NoteAttributes {

  getInteractions(userId?: number, type?: InteractionType | InteractionType[]): Promise<I[]> {
    throw new Error('Method not implemented.');
  }

}