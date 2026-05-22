/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

import { Injectable } from '@nestjs/common'
import fs from 'node:fs/promises'
import nodemailer from 'nodemailer'
import Handlebars from 'handlebars'
import { AllConfigType } from '../config/config.type'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.transporter = nodemailer.createTransport({
      host: configService.getOrThrow('mail.host', { infer: true }),
      port: configService.getOrThrow('mail.port', { infer: true }),
      ignoreTLS: configService.getOrThrow('mail.ignoreTLS', { infer: true }),
      secure: configService.getOrThrow('mail.secure', { infer: true }),
      requireTLS: configService.getOrThrow('mail.requireTLS', { infer: true }),
      auth: {
        user: configService.getOrThrow('mail.user', { infer: true }),
        pass: configService.getOrThrow('mail.password', { infer: true }),
      },
    })
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string
    context: Record<string, unknown>
  }): Promise<void> {
    let html: string | undefined
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8')
      html = Handlebars.compile(template, {
        strict: true,
      })(context)
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.getOrThrow('mail.defaultName', {
            infer: true,
          })}" <${this.configService.getOrThrow('mail.defaultEmail', {
            infer: true,
          })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    })
  }
}
