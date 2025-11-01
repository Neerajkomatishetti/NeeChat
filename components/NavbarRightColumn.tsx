"use client";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { login } from "@/lib/actions/login";
import { useState } from "react";

const NavbarRightColumn = () => {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <div className="flex relative [&>*]:m-1">
      {openModal && (
        <div className="flex w-[100vw] h-[100vh] absolute top-0 left-0 justify-center items-center ">
          <div>
            <form>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input type="password" placeholder="Password" />
              <Button
                className="rounded-full"
                onClick={() => {
                  login(email);
                }}
              >
                SignIn
              </Button>
            </form>
          </div>
        </div>
      )}
      <Button
        type="submit"
        className="rounded-full"
        onClick={() => {
          console.log("clicked");
          setOpenModal((openModal) => !openModal);
        }}
      >
        SignIn
      </Button>
      <ModeToggle />
    </div>
  );
};

export default NavbarRightColumn;
