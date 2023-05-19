import Head from "next/head";
import Layout from "../layout/layout";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Form.module.css";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useFormik } from "formik";
import login_validate from "../lib/validate";
import { useRouter } from "next/router";

export default function () {
  return (
    <Layout>
      <Head>
        <title>Contact</title>
      </Head>
      <section className="w-3/4 mx-auto flex flex-col gap-10">
        <div className="title">
          {/* <h1 className="text-gray-800 text-4xl font-bold py-4">Contact Me</h1> */}
        </div>

        <div className="input-button">
          <Image
            src={"/assets/janluWechat.svg"}
            width={2500}
            height={2500}
          ></Image>
          <p className="w-3/4 mx-auto text-gray-400">
            Scan the QR code to add me as a friend.
          </p>
          <p className="w-3/4 mx-auto text-gray-400">
            扫一扫上面的二维码图案，加我为好友。
          </p>
        </div>
        <form className="flex flex-col gap-5"></form>
        {/* buttom */}
        {/* <p className="text-center text-gray-400'">
          Don't have a account yet?{" "}
          <Link href={"/register"} className="text-blue-700 ">
            Sign Up
          </Link>
        </p> */}
      </section>
    </Layout>
  );
}
