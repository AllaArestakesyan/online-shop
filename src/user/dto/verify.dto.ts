import { ApiProperty } from "@nestjs/swagger"

export class Verify {
    @ApiProperty()
    email: string
    @ApiProperty()
    emailToken: string
  }

  