import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  // Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface YelpRecentLoginEmailProps {
  name: string;
  email: string;
  job: string;
  status: "accept" | "reject";
  feedback: string;
}

export const YelpRecentLoginEmail = ({
  name,
  job,
  status,
  feedback,
}: YelpRecentLoginEmailProps) => {
  // const { Logo } = useContext(contextApp);
  const formattedName = name.toUpperCase();
  const isAccepted = status === "accept";

  const message = isAccepted
    ? `Dear ${formattedName},\n\nWe are pleased to inform you that you have been selected for the ${job} position. Please find the offer letter attached. We look forward to welcoming you to our team and will be in touch shortly with the next steps.\n\n`
    : `Dear ${formattedName},\n\nThank you for taking the time to apply for the ${job} position. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\n`;

  return (
    <Html>
      <Head />
      <Preview>
        {isAccepted
          ? `You're accepted for the ${job} position`
          : `Update on your ${job} application`}
      </Preview>
      <Body style={main}>
        <Container>
          <Section style={unifiedSection}>
            {/* Logo */}
            {/* <Img
              src={Logo}
              alt="Company Logo"
              width={120}
              sizes="100vw"
              style={{ margin: "0 auto", marginBottom: "20px" }}
            /> */}

            {/* Konten utama */}
            <Heading style={heading}>Job Application Update</Heading>
            <Text
              style={paragraph}
              dangerouslySetInnerHTML={{
                __html: message.replace(/\n/g, "<br />"),
              }}
            />
            <Text style={{ ...paragraph, marginTop: 10 }}>
              <b>Feedback:</b>
              <br />
              {feedback}
            </Text>
          </Section>

          {/* Footer */}
          <Text style={footer}>
            © 2025 | GrowTavern Careers — This email was sent to {name}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default YelpRecentLoginEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const unifiedSection = {
  border: "1px solid #eaeaea",
  borderRadius: "4px",
  padding: "20px",
  maxWidth: "600px",
  margin: "20px auto",
  backgroundColor: "#ffffff",
  textAlign: "center" as const,
};

const image = {
  maxWidth: "100%",
  margin: "0 auto",
  marginBottom: "20px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.5",
  textAlign: "left" as const,
};

const footer = {
  fontSize: "12px",
  textAlign: "center" as const,
  color: "#888",
  padding: "20px",
};
