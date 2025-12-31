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

const RootPage = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [balakName, setBalakName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobile, setMobile] = useState("");
  const [noMobile, setNoMobile] = useState(false);
  const [sabha, setSabha] = useState("");
  const [age, setAge] = useState("");
  const [isNewBalak, setIsNewBalak] = useState(false);
  const [place, setPlace] = useState("");

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

  const handleSubmit = () => {
    if (!balakName || !fatherName || !sabha || !age) {
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

    toast.success("Participant added successfully 🏅", {
      description: `${balakName} (${age} yrs) registered`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="font-medium w-full max-w-lg p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-center">
          Kids Olympics Registration 🏅
        </h1>

        <div className="space-y-4">
          {/* Image */}
          <div className="space-y-2">
            <Label>Child Photo</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />

            {imagePreview && (
              <div className="relative mt-2 w-32 h-32 rounded-lg overflow-hidden border">
                <img
                  src={imagePreview}
                  alt="Preview"
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

          {/* Balak Name */}
          <div className="space-y-1">
            <Label>Balak Name</Label>
            <Input
              type="text"
              placeholder="Enter child name"
              value={balakName}
              onChange={(e) => setBalakName(e.target.value)}
            />
          </div>

          {/* Father Name */}
          <div className="space-y-1">
            <Label>Father Name</Label>
            <Input
              type="text"
              placeholder="Enter father name"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
            />
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
                </SelectContent>
              </Select>
            </div>

            {/* New Balak */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label>New Balak</Label>
                <Switch
                  checked={isNewBalak}
                  className={'scale-80'}
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
          </div>
          {/* Mobile Number */}
          <div className="space-y-2">
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
          <Button onClick={handleSubmit} className="font-bold w-full mt-4">
            Add Participant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RootPage;
