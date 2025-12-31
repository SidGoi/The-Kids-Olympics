"use client";
import React, { useState } from "react";
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
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

const RootPage = () => {
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
      toast.error("Please enter Place for New Balak!");
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);

    toast.success(`${balakName} (${age} yrs) registered! 🏅`);

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
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/40 p-8">
      <div className="font-medium w-full max-w-lg">
        <div className="space-y-5">
          {/* Image */}
          <div className="space-y-3">
            <Label>Balak Photo</Label>
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <div className="relative mt-2 w-32 h-32 rounded-lg overflow-hidden border">
                <Image
                  src={imagePreview}
                  alt="Preview Image"
                  height={200}
                  width={200}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 rounded-full bg-black/60 text-white text-xs px-2 py-1"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-5">
            {/* Balak Name */}
            <div className="space-y-3 w-full">
              <Label>Balak Name</Label>
              <Input
                type="text"
                placeholder="Enter child name"
                value={balakName}
                onChange={(e) => setBalakName(e.target.value)}
              />
            </div>

            {/* Father Name */}
            <div className="space-y-3 w-full">
              <Label>Surname</Label>
              <Input
                type="text"
                placeholder="Enter surname"
                value={surname} // you can optionally rename state to `surname`
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            {/* Age */}
            <div className="space-y-3">
              <Label>Age</Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Age" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(15)].map((_, i) => {
                    const ageValue = i + 4;
                    return (
                      <SelectItem key={ageValue} value={ageValue.toString()}>
                        {ageValue}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {/* Mandal / Sabha */}
            <div className="space-y-3">
              <Label>BalSabha</Label>
              <Select value={sabha} onValueChange={setSabha}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mandal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sardarkunj">Sardarkunj</SelectItem>
                  <SelectItem value="Akshar Colony">Akshar Colony</SelectItem>
                  <SelectItem value="Vanmalivanka Ni Pole">
                    Vanmalivanka Ni Pole
                  </SelectItem>
                  <SelectItem value="Vadikotdi Ni Pole">
                    Vadikotdi Ni Pole
                  </SelectItem>
                  <SelectItem value="Aambalivali Pole">
                    Aambalivali Pole
                  </SelectItem>
                  <SelectItem value="Gheekanta">Gheekanta</SelectItem>
                  <SelectItem value="Vadigam">Vadigam</SelectItem>
                  <SelectItem value="Shivshakti">Shivshakti</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* New Balak */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label>New Balak</Label>
              <Switch
                checked={isNewBalak}
                className={"scale-80"}
                onCheckedChange={(checked) => {
                  setIsNewBalak(checked);
                  if (!checked) setPlace("");
                }}
              />
            </div>

            <Input
              type="text"
              placeholder="Enter Place"
              value={place}
              disabled={!isNewBalak}
              onChange={(e) => setPlace(e.target.value)}
            />
          </div>
          {/* Mobile Number */}
          <div className="space-y-3">
            <Label>Mobile Number</Label>
            <Input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              disabled={noMobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <div className="flex items-center gap-3">
              <Switch
                checked={noMobile}
                onCheckedChange={(checked) => {
                  setNoMobile(checked);
                  if (checked) setMobile("");
                }}
              />
              <span className="text-sm text-muted-foreground">
                Don’t know mobile number
              </span>
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 font-bold"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="h-4 w-4" />
                Adding...
              </div>
            ) : (
              "Add Participant"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RootPage;
