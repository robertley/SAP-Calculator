import json
with open('src/app/files/pets.json') as f:
    data=json.load(f)
for pet in data:
    if pet['Name']=='Jersey Devil':
        for ability in pet.get('Abilities', []):
            print(ability['About'])
