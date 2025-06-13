

### **Pharmacy API Documentation**

#### **Base URL**
```
http://127.0.0.1:8000/api/pharmacy
```

---

### **Endpoints**

#### **1. Create a New Drug**
- **Method**: `POST`
- **URL**: `/drugs`
- **Request Body**:
  ```json
  {
    "name": "Paracetamol",
    "photoUrl": "https://example.com/paracetamol.jpg",
    "dosageForm": "Tablet",
    "administrationMethod": "Oral",
    "genericName": "Acetaminophen",
    "stock": 500,
    "minStockThreshold": 100,
    "composition": "Paracetamol 500mg",
    "laboratory": "PharmaLab Inc.",
    "unitPrice": 0.50,
    "storageCondition": "roomTemperature",
    "comment": "For pain relief and fever reduction."
  }
  ```

---

#### **2. Edit an Existing Drug**
- **Method**: `PUT`
- **URL**: `/drugs/:id`
- **Request Body**:
  ```json
  {
    "stock": 600,
    "minStockThreshold": 150
  }
  ```

---

#### **3. Delete a Drug**
- **Method**: `DELETE`
- **URL**: `/drugs/:id`

---

#### **4. Search for Drugs**
- **Method**: `GET`
- **URL**: `/drugs/search?field=name&query=Paracetamol`
- **Query Parameters**:
  - `field`: The field to search by (e.g., `name`, `genericName`, `composition`).
  - `query`: The search term.

---

#### **5. Get All Drugs**
- **Method**: `GET`
- **URL**: `/drugs`

---

#### **6. Get a Drug by ID**
- **Method**: `GET`
- **URL**: `/drugs/:id`

---

#### **7. Add Dosage Information for a Drug**
- **Method**: `POST`
- **URL**: `/drugs/:drugId/dosage`
- **Request Body**:
  ```json
  {
    "fromAge": 0,
    "toAge": 12,
    "dose": 250
  }
  ```

---

### **Example Requests**

#### **Create a Drug**
```bash
POST http://127.0.0.1:8000/api/pharmacy/drugs
```

#### **Edit a Drug**
```bash
PUT http://127.0.0.1:8000/api/pharmacy/drugs/550e8400-e29b-41d4-a716-446655440000
```

#### **Delete a Drug**
```bash
DELETE http://127.0.0.1:8000/api/pharmacy/drugs/550e8400-e29b-41d4-a716-446655440000
```

#### **Search for Drugs**
```bash
GET http://127.0.0.1:8000/api/pharmacy/drugs/search?field=name&query=Paracetamol
```

#### **Get All Drugs**
```bash
GET http://127.0.0.1:8000/api/pharmacy/drugs
```

#### **Get a Drug by ID**
```bash
GET http://127.0.0.1:8000/api/pharmacy/drugs/550e8400-e29b-41d4-a716-446655440000
```

#### **Add Dosage Information**
```bash
POST http://127.0.0.1:8000/api/pharmacy/drugs/550e8400-e29b-41d4-a716-446655440000/dosage
```

---

### **Notes**
- Replace `:id` and `:drugId` with actual IDs.
- Ensure the `Content-Type` header is set to `application/json` for `POST` and `PUT` requests.


