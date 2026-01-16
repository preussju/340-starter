
--1
INSERT INTO public.account (account_firstname,account_lastname,account_email,account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--2
UPDATE public.account 
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--3
DELETE FROM public.account 
WHERE account_id = '1';

--4

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

--5 

SELECT classification_name, inventory.inv_make, inventory.inv_model
FROM public.classification
JOIN public.inventory
	ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

--6

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/') ;