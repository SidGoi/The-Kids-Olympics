"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";

const OTP_PASSWORD = "108108";

const RegistrationPage = () => {
  const [authorized, setAuthorized] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [balakName, setBalakName] = useState("");
  const [surname, setSurname] = useState("");
  const [mobile, setMobile] = useState("");
  const [noMobile, setNoMobile] = useState(false);
  const [sabha, setSabha] = useState("");
  const [age, setAge] = useState("");
  const [isNewBalak, setIsNewBalak] = useState(false);
  const [place, setPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [playingCount, setPlayingCount] = useState(0);

  useEffect(() => {
    const savedPassword = localStorage.getItem("registrationPassword");
    if (savedPassword === OTP_PASSWORD) {
      setAuthorized(true);
    }

    const fetchCount = () => {
      fetch("/api/balak/count")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPlayingCount(data.totalKids);
          }
        });
    };

    fetchCount();
    const interval = setInterval(fetchCount, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpSubmit = () => {
    if (otp === OTP_PASSWORD) {
      localStorage.setItem("registrationPassword", OTP_PASSWORD);
      toast.success("OTP Verified! 🎉");
      setAuthorized(true);
    } else {
      toast.error("Wrong OTP! Try again.");
      setOtp("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Logic for Instant Addition (Optimistic Update)
  const handleSubmit = async () => {
    if (!balakName || !surname || !sabha || !age) {
      toast.error("Please fill all Details!");
      return;
    }

    if (!noMobile) {
      if (!mobile) {
        toast.error("Mobile number is required!");
        return;
      }
      if (mobile.length !== 10) {
        toast.error("Mobile Number must be 10 digits!");
        return;
      }
    }

    if (isNewBalak && !place) {
      toast.error("Please enter Address for New Balak!");
      return;
    }

    // --- START OPTIMISTIC UPDATE ---
    // 1. Instantly increase the count locally
    const previousCount = playingCount;
    setPlayingCount((prev) => prev + 1);

    // 2. Capture form data to clear the UI immediately
    const tempBalakName = balakName;
    
    // 3. Clear UI instantly
    setImage(null);
    setImagePreview(null);
    setBalakName("");
    setSurname("");
    setMobile("");
    setNoMobile(false);
    setSabha("");
    setAge("");
    setIsNewBalak(false);
    setPlace("");
    
    // 4. Show success toast instantly
    toast.success(`${tempBalakName} registered successfully 🏅`);
    // --- END OPTIMISTIC UPDATE ---

    // Now handle the actual server request in the background
    const formData = new FormData();
    formData.append("image", image);
    formData.append("firstName", tempBalakName);
    formData.append("lastName", surname);
    formData.append("age", age);
    formData.append("sabha", sabha);
    formData.append("mobile", noMobile ? "" : mobile);
    formData.append("address", isNewBalak ? place : "");

    try {
      const res = await fetch("/api/balak/add", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Server error");
      }
      // If server is okay, we do nothing because the UI is already updated.
    } catch (error) {
      // ROLLBACK: If background request fails, revert the count and notify
      setPlayingCount(previousCount);
      toast.error(`Failed to sync ${tempBalakName} to server. Please check connection.`);
    }
  };

  if (!authorized) {
    return (
      <>
        <Toaster richColors position="bottom-right" />
        <Dialog open={!authorized} onOpenChange={(open) => !open && router.push("/")}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-semibold">
                Enter 6-digit Password
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                type="text"
                maxLength={6}
                placeholder="Enter Password"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
                className="text-center text-lg"
              />
              <Button onClick={handleOtpSubmit} className="w-full">
                Go to Registration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-10 bg-muted/40 p-8">
      <Link href={"/"}>
          <Button className={"flex items-center justify-center gap-1 mb-4"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="m314-440 114 114q12 12 11.5 28T428-270q-12 12-28.5 12.5T371-269L188-452q-12-12-12-28t12-28l183-183q12-12 28.5-11.5T428-690q11 12 11.5 28T428-634L314-520h446q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H314Z" />
            </svg>{" "}
            Back to Home
          </Button>
        </Link>
      <Toaster richColors position="bottom-right" />
      <header className="flex items-center justify-between border-b pb-5 border-gray-600">
        <h1 className="text-2xl font-bold text-primary">Logo</h1>
        <p className="flex items-center gap-2 font-semibold">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Playing: {playingCount}
        </p>
      </header>

      <div className="font-medium w-full max-w-lg mx-auto">
        <div className="space-y-5">
          <div className="space-y-3">
            <Label>Balak Photo</Label>
            <Input type="file" accept="image/*" capture="environment" onChange={handleImageChange} />
            {imagePreview && (
              <div className="relative mt-2 w-32 h-32 rounded-lg overflow-hidden border">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button onClick={removeImage} className="absolute top-1 right-1 rounded-full bg-black/60 text-white text-xs px-2 py-1">✕</button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-5">
            <div className="space-y-3 w-full">
              <Label>Balak Name</Label>
              <Input placeholder="Enter child name" value={balakName} onChange={(e) => setBalakName(e.target.value)} />
            </div>
            <div className="space-y-3 w-full">
              <Label>Surname</Label>
              <Input placeholder="Enter surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="space-y-3">
              <Label>Age</Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger className="w-[120px]"><SelectValue placeholder="Age" /></SelectTrigger>
                <SelectContent>{[...Array(18)].map((_, i) => (<SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>BalSabha</Label>
              <Select value={sabha} onValueChange={setSabha}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select Mandal" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sardarkunj">Sardarkunj</SelectItem>
                  <SelectItem value="Akshar Colony">Akshar Colony</SelectItem>
                  <SelectItem value="Vanmalivanka Ni Pole">Vanmalivanka Ni Pole</SelectItem>
                  <SelectItem value="Vadikotdi Ni Pole">Vadikotdi Ni Pole</SelectItem>
                  <SelectItem value="Aambalivali Pole">Aambalivali Pole</SelectItem>
                  <SelectItem value="Gheekanta">Gheekanta</SelectItem>
                  <SelectItem value="Vadigam">Vadigam</SelectItem>
                  <SelectItem value="Shivshakti">Shivshakti</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1"><Label>New Balak</Label><Switch checked={isNewBalak} onCheckedChange={(checked) => {setIsNewBalak(checked); if(!checked) setPlace("");}} /></div>
            <Input placeholder="Enter Address (Short)" value={place} disabled={!isNewBalak} onChange={(e) => setPlace(e.target.value)} />
          </div>

          <div className="space-y-3">
            <Label>Mobile Number</Label>
            <Input type="tel" placeholder="Enter mobile number" value={mobile} disabled={noMobile} onChange={(e) => setMobile(e.target.value)} />
            <div className="flex items-center gap-3"><Switch checked={noMobile} onCheckedChange={(checked) => {setNoMobile(checked); if(checked) setMobile("");}} /><span className="text-sm text-muted-foreground">Don’t know mobile number</span></div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full mt-4 font-bold" size="lg">
            Add Participant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;