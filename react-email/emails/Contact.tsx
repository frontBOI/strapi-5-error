import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview, // @ts-ignore
  Tailwind,
  Text,
} from '@react-email/components'

import Fonts from '../Fonts'

interface Props {
  email: string
  message: string
  lastname: string
  firstName: string
}

export default function Contact({
  firstName = 'Tom',
  lastname = 'Blanchet',
  email = 'text@fake.com',
  message = 'Je vous laisse un message car je vous apprécie',
}: Props) {
  const previewText = `${firstName} ${lastname} essaie d'entrer en contact avec toi.`

  return (
    <Html>
      <Head>
        <Fonts />
      </Head>

      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[550px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 mb-[30px] mx-0">
              <span className="font-bold">
                {firstName} {lastname}
              </span>{' '}
              souhaite entrer en contact avec toi.
            </Heading>

            <Text className="text-black text-[40px] leading-[24px] mt-[30px]">«</Text>
            <Text className="text-black text-[14px] mx-auto text-center leading-[24px] max-w-[300px]">{message}</Text>
            <Text className="text-black text-[40px] leading-[24px] mb-[30px] text-right">»</Text>

            <Text className="text-black text-[14px] leading-[24px]">Tu peux lui répondre à cette adresse: {email}</Text>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-[#7b7b7b] text-[12px] leading-[24px]">
              Ce message t'a été envoyé via le formulaire de contact de ton site web.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
