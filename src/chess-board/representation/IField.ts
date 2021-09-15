import { offsetsEnum } from '../chess-board-offsets';
import { fileType, rankType } from "./fileType";


export interface IField {
    shift(offset: offsetsEnum, factor?: number): IField;
    same(f: IField): boolean;
    sameI(file_: fileType, rank_: rankType): boolean;
    isOnBoard(): boolean;
    get file(): fileType; get rank(): rankType; get notation(): string; createField(file_: fileType, rank_: rankType): IField;
    isDiagonal(target: IField): offsetsEnum | undefined;
    isHorizontalVertical(target: IField): offsetsEnum | undefined;
}
