"use server";
import { redirect } from "next/navigation";
import { createClient } from "@repo/supabase/server";
import { Provider } from "@repo/supabase/types";
import { revalidatePath } from "next/cache";

const signInWithPassword = async (formData: FormData) => {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/auth/signup");
  }

  return redirect("/");
};

const signInWithOAuth = async (provider: Provider) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    redirect("/auth/signup");
  }

  if (data?.url) {
    return redirect(data.url);
  }

  return redirect("/");
};

const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  return redirect("/auth/signin");
};

const signUpWithPassword = async (formData: FormData) => {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  return redirect("/");
};

export { signInWithPassword, signInWithOAuth, signUpWithPassword, signOut };
