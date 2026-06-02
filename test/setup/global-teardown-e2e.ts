import { closeTestApp } from './create-test-app'
import 'tsconfig-paths/register'
export default async () => {
  await closeTestApp()
}
