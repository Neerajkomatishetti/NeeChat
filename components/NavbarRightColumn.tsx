"use client";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

type NavbarRightColumnProps = {
  openModal: boolean;
  toggleModal: (openModal: boolean) => void;
};

const NavbarRightColumn = ({
  openModal,
  toggleModal,
}: NavbarRightColumnProps) => {
  return (
    <div className="flex relative [&>*]:m-1">
      <Button
        type="submit"
        className="bg-secondary border border-solid border-Primary hover:text-secondary text-primary"
        onClick={() => {
          console.log("clicked");
          toggleModal(true);
          console.log(openModal);
        }}
      >
        SignIn
      </Button>
      <ModeToggle />
    </div>
  );
};

export default NavbarRightColumn;
