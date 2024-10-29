import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section, // @ts-ignore
  Tailwind,
  Text,
} from '@react-email/components'

import Fonts from '../Fonts'

interface Props {
  firstName: string
}

export default function AdminInitializationSuccessful({ firstName }: Props) {
  const previewText = 'Félicitations, tu as terminé de configurer ton portail administrateur.'
  const baseUrl = `https://${process.env.DOMAIN}`

  return (
    <Html>
      <Head>
        <Fonts />
      </Head>

      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[550px]">
            <Heading className="text-black text-[24px] font-bold text-center p-0 mb-[30px] mx-0">
              Bienvenue dans ton backoffice {firstName} 🎉
            </Heading>

            <Text className="text-black text-[14px] leading-[24px]">
              Tu as terminé de configurer ton portail administrateur. Les mails qui seront envoyés par ton site internet
              le seront par l'adresse mail expéditrice de ce mail.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                href={`${baseUrl}/backoffice`}
                className="bg-[#e6d6c2] rounded text-white text-[12px] font-semibold no-underline text-center px-8 py-4"
              >
                Accéder à mon backoffice
              </Button>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-[#7b7b7b] text-[12px] leading-[24px]">
              Si tu as la moindre question, n'hésite pas à me contacter à l'adresse contact@tomblanchet.fr.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
