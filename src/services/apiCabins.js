import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error("Cabins could not be loaded");
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  // Check if cabin already has an image path ie. are updating or creating a new cabin
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // Remove "/" in image path to prevent supabase from creating folders
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  // If editing cabin and already has an image path, set it to the current value. Else if creating a new cabin create the proper supabase image path for the database table
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create cabin
  // Set base api url
  let query = supabase.from("cabins");

  // A) CREATE - If no Id passed in, create a new cabin — supabase.from("cabins").insert([{ ...newCabin, image: imagePath }])
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) EDIT - If Id found, update cabin — supabase.from("cabins").update({ ...newCabin, image: imagePath }).eq("id", id);
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  // Supabase returns the inserted row on a successful insert operation, so get the data back to use or check if an error happened
  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Upload image
  // If image path is already there, skip and dont' do anything
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images") // supabase bucket name
    .upload(imageName, newCabin.image); // supabase file path and file

  // 3. Delete the cabin if there was an error uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log("Cabin could not be deleted");
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
