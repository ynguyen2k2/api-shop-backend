import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { HttpException } from '@nestjs/common'
import { MyLogger } from 'logger/mylogger.service'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly myLogger = new MyLogger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500

    // Log full error to terminal
    if (exception instanceof Error) {
      this.myLogger.error(
        `${exception.message}`,
        exception.stack, // <-- This prints the full stack trace!
        'AllExceptionsFilter',
      )
    } else {
      this.myLogger.error(
        `Unknown exception: ${JSON.stringify(exception)}`,
        '',
        'AllExceptionsFilter',
      )
    }

    // Optional: send a response to client
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof Error ? exception.message : 'Internal error',
    })
  }
}
