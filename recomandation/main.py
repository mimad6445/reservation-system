from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import SearchRequest
from database import products_collection
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId
from datetime import datetime
import logging
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def serialize_product(product):
    return {
        "_id": str(product["_id"]),
        "name": product.get("name"),
        "description": product.get("description"),
        "priceInPoints": product.get("priceInPoints"),
        "image": product.get("image"),
        "user": str(product.get("user")) if product.get("user") else None,
        "available": product.get("available"),
        "category": product.get("category"),
        "countInStock": product.get("countInStock"),
        "rating": product.get("rating"),
        "numReviews": product.get("numReviews"),
        "tags": product.get("tags"),
        "createdAt": product.get("createdAt").isoformat() if isinstance(product.get("createdAt"), datetime) else product.get("createdAt"),
        "updatedAt": product.get("updatedAt").isoformat() if isinstance(product.get("updatedAt"), datetime) else product.get("updatedAt"),
    }

def flatten_product(product):
    tags_raw = product.get("tags", [])
    try:
        tags = json.loads(tags_raw[0]) if tags_raw else []
    except Exception:
        tags = []
    return f"{product.get('name', '')} {product.get('description', '')} {' '.join(tags)}"

def extract_tags(product):
    try:
        return json.loads(product["tags"][0]) if product.get("tags") else []
    except Exception:
        return []

@app.post("/api/search")
async def search_products(req: SearchRequest):
    logger.info(f"Search query received: {req.query}")
    query = req.query.strip().lower()
    if not query:
        raise HTTPException(status_code=400, detail="Empty query")

    try:
        all_products = await products_collection.find({}).to_list(100)
        logger.info(f"Fetched {len(all_products)} products from DB")
    except Exception as e:
        logger.error(f"DB error: {e}")
        raise HTTPException(status_code=500, detail="Error accessing database")

    if not all_products:
        return []

    # TF-IDF Search
    corpus = [query] + [flatten_product(p).lower() for p in all_products]
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(corpus)
    scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    matched = [(score, prod) for score, prod in zip(scores, all_products) if score > 0.1]
    matched.sort(key=lambda x: x[0], reverse=True)

    matched_products = [prod for _, prod in matched]
    matched_ids = {str(prod["_id"]) for prod in matched_products}

    # Gather tags from matched products
    tag_set = set()
    for prod in matched_products:
        tag_set.update(extract_tags(prod))

    # Find related products by tag
    related_products = []
    for prod in all_products:
        prod_tags = set(extract_tags(prod))
        if prod_tags & tag_set and str(prod["_id"]) not in matched_ids:
            related_products.append(prod)

    logger.info(f"Matched: {len(matched_products)}, Related by tags: {len(related_products)}")

    full_result = matched_products + related_products
    return [serialize_product(prod) for prod in full_result]
