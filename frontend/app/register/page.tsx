"use client";
import { BasePage } from "@/components/common/base-page";
import RegisterCard from "@/components/register/card";
import { useRouter } from "next/navigation";
function Page() {
  const router = useRouter();

  const handleRegister = (type: "freelance" | "company") => {
    router.push(`/register/${type}`);
  };

  return (
    <BasePage>
      <div className="flex flex-col items-center gap-8 md:gap-20 my-10 md:my-28">
        <div className="flex flex-col justify-center items-center gap-2 self-stretch px-4">
          <div className="flex p-5 justify-center items-center gap-2">
            <p className="text-freehunt-main text-2xl md:text-4xl text-center font-bold">
              Bienvenue !
            </p>
          </div>
          <p className="text-freehunt-black-two text-xl md:text-2xl text-center font-normal">
            Quel type de profil êtes-vous ?
          </p>
        </div>
        <div className="flex flex-row justify-center items-center gap-4 md:gap-20 self-stretch px-4 overflow-x-auto">
          <RegisterCard
            title="Entreprise"
            description="Je chasse des freelances"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="65"
                viewBox="0 0 64 65"
                fill="none"
              >
                <path
                  d="M53.3332 16.5002H42.6666V11.1668C42.6666 8.20683 40.2932 5.8335 37.3332 5.8335H26.6666C23.7066 5.8335 21.3332 8.20683 21.3332 11.1668V16.5002H10.6666C7.70658 16.5002 5.35992 18.8735 5.35992 21.8335L5.33325 51.1668C5.33325 54.1268 7.70658 56.5002 10.6666 56.5002H53.3332C56.2932 56.5002 58.6666 54.1268 58.6666 51.1668V21.8335C58.6666 18.8735 56.2932 16.5002 53.3332 16.5002ZM37.3332 16.5002H26.6666V11.1668H37.3332V16.5002Z"
                  fill="#FF4D6D"
                />
              </svg>
            }
            onClick={() => handleRegister("company")}
          />
          <RegisterCard
            title="Freelance"
            description="Je chasse des entreprises"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="65"
                viewBox="0 0 64 65"
                fill="none"
              >
                <path
                  d="M40 24.4998H45.3333V29.8332H40V24.4998ZM45.3333 13.8332H40V19.1665H45.3333V13.8332ZM29.3333 40.4999H34.6667V35.1665H29.3333V40.4999ZM34.6667 13.8332H29.3333V19.1665H34.6667V13.8332ZM29.3333 29.8332H34.6667V24.4998H29.3333V29.8332ZM24 13.8332H18.6667V19.1665H24V13.8332ZM24 24.4998H18.6667V29.8332H24V24.4998ZM38.8 56.4999H34.6667V47.1665H29.3333V56.4999H13.3333V8.49984H50.6667V29.9132C52.56 30.0732 54.3734 30.6599 56 31.5132V3.1665H8V61.8332H42.4267C41.3333 60.3399 40 58.5265 38.8 56.4999ZM18.6667 51.1665H24V45.8332H18.6667V51.1665ZM24 35.1665H18.6667V40.4999H24V35.1665ZM58.6667 44.4999C58.6667 51.4332 49.3334 61.8332 49.3334 61.8332C49.3334 61.8332 40 51.4332 40 44.4999C40 39.4332 44.2667 35.1665 49.3334 35.1665C54.4 35.1665 58.6667 39.4332 58.6667 44.4999ZM52.5334 44.7665C52.5334 43.1665 50.9333 41.5665 49.3334 41.5665C47.7333 41.5665 46.1333 42.8999 46.1333 44.7665C46.1333 46.3665 47.4667 47.9665 49.3334 47.9665C51.2 47.9665 52.8 46.3665 52.5334 44.7665Z"
                  fill="#FF4D6D"
                />
              </svg>
            }
            onClick={() => handleRegister("freelance")}
          />
        </div>
      </div>
    </BasePage>
  );
}

export default Page;
