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
  clientFirstName: string
  clientLastName: string
  elements: any[]
  totalTTC: number
}

export default function NewCommand({
  totalTTC = 129,
  clientFirstName = 'Éric',
  clientLastName = 'Clapton',
  elements = [
    {
      quantity: 2,
      element: {
        name: 'Guitare',
      },
    },
    {
      quantity: 1,
      element: {
        name: 'Batterie',
      },
    },
  ],
}: Props) {
  const nbProducts = elements.reduce((acc, product) => acc + product.quantity, 0)
  const previewText = `Félicitations, nouvelle commande de ${nbProducts} produits pour ${totalTTC}€.`
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
              {clientFirstName} {clientLastName} vient de commander {nbProducts} produits 🎉
            </Heading>

            <Text className="text-black text-[14px] leading-[24px]">Voici les produits commandés :</Text>

            {elements.map((product, index) => (
              <Text key={index}>
                - {product.element.name} x{product.quantity}
              </Text>
            ))}

            <Text className="text-black text-[14px] leading-[24px]">
              Tu peux consulter les détails de cette commande sur ton backoffice :
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
              Ce mail t'a été automatiquement envoyé par ton système de gestion de commandes.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
