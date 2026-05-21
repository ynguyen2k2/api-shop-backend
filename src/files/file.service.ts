import { Injectable } from '@nestjs/common'
import { FileType } from 'files/domain/file'
import { FileRepository } from 'files/infrastructure/persistence/file-repository'
import { NullableType } from 'utils/type/nullable.type'

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileRepository) {}

  findById(id: FileType['id']): Promise<NullableType<FileType>> {
    return this.fileRepository.findById(id)
  }

  findByIds(ids: FileType['id'][]): Promise<FileType[]> {
    return this.fileRepository.findByIds(ids)
  }
}
