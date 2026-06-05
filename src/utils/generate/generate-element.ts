import { HttpStatus, UnprocessableEntityException } from '@nestjs/common'

export const combineElement = (
  arrays: any[][],
  maxCombinations: number = 1000,
): any[][] => {
  let result: any[][] = [[]]
  if (arrays.length === 0) {
    return []
  }
  const calculateTotalCombinations = (arrays: any[][]): number => {
    return arrays.reduce((total, array) => total * array.length, 1)
  }

  if (calculateTotalCombinations(arrays) > maxCombinations) {
    throw new UnprocessableEntityException({
      HttpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: {
        status: 'tooManyCombinations',
      },
    })
  }

  for (const array of arrays) {
    const newResult: any[][] = []
    for (const existing of result) {
      for (const item of array) {
        newResult.push([...existing, item])
      }
    }
    result = newResult
  }
  return result
}
