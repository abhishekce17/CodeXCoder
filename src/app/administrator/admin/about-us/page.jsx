"use client"
import React, {useEffect, useState} from 'react';
import styles from '@/Styles/HelpAndFAQ.module.css';
import Link from 'next/link';
import Loading from '../loading';
import {notify} from '@/JS/notify';

const AboutUs = () => {
  // const [companyInfo, setCompanyInfo] = useState({
  //   name: 'ShopNest',
  //   description:
  //     'ShopNest is a leading e-commerce company that provides a wide range of products to customers worldwide. We are dedicated to simplifying the online shopping experience and bringing high-quality goods right to your doorstep.',
  //   mission:
  //     'To provide a seamless and enjoyable online shopping experience by offering a diverse selection of products, exceptional customer service, and innovative technology.',
  //   values: [
  //     'Customer-Centric: We prioritize our customers\' needs and satisfaction above all else.',
  //     'Quality Assurance: We guarantee the quality and authenticity of every product we sell.',
  //     'Innovation: We constantly seek new ways to improve our platform and services.',
  //     'Integrity: We operate with honesty, transparency, and ethical conduct in all our business dealings.',
  //     'Community Engagement: We actively support and engage with our local and global communities.',
  //   ],
  //   productCategories: [
  //     'Electronics & Gadgets',
  //     'Fashion & Apparel',
  //     'Home & Living',
  //     'Beauty & Personal Care',
  //     'Sports & Outdoors',
  //     'Toys & Games',
  //     'Books & Media',
  //     'Automotive & Tools',
  //     'Food & Groceries',
  //   ],
  //   keyFeatures: [
  //     'User-Friendly Website: Our website is designed to be easy to navigate, making it simple for customers to find and purchase their desired products.',
  //     'Secure Payment: We ensure safe and secure payment options to protect our customers\' financial information.',
  //     'Fast Shipping: ShopNest offers speedy delivery options to get products to customers as quickly as possible.',
  //     'Customer Support: Our dedicated customer support team is available to assist customers with any questions or concerns.',
  //     'Product Reviews: Read honest reviews from other customers to make informed purchase decisions.',
  //   ],
  //   globalReach: 'ShopNest ships products worldwide, providing access to our wide range of products to customers in different countries.',
  //   headquarters: 'ShopNest Inc.\n123 E-commerce Way\nCityville, USA',
  //   contact: {
  //     email: 'info@shopnest.com',
  //     phone: '+1-800-123-4567',
  //     facebook: 'https://www.facebook.com/shopnest',
  //     instagram: 'https://www.instagram.com/shopnest',
  //     // Add links to other social media profiles if needed
  //   },
  //   founderCEO: 'John Doe',
  //   history:
  //     'ShopNest was founded in 20XX by John Doe with the vision of creating a user-friendly online marketplace that offers a diverse range of products. Over the years, it has grown into a trusted name in the e-commerce industry, serving millions of satisfied customers worldwide.',
  //   futureGoals: [
  //     'Expand our product range to offer even more choices to our customers.',
  //     'Enhance our mobile app for a seamless shopping experience on-the-go.',
  //     'Continue investing in sustainability initiatives to reduce our carbon footprint.',
  //   ],
  // });
  const [isLodaing, setIsLoading] = useState(true)
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    description: '',
    mission: '',
    values: [],
    productCategories: [],
    keyFeatures: [],
    globalReach: '',
    headquarters: '',
    contact: {
      email: '',
      phone: '',
    },
    founderCEO: '',
    history: '',
    futureGoals: '',
  })
  const [submittedInfo, setSubmittedInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isInfoValid, setIsInfoValid] = useState(true);

  const handlePreview = async () => {
    if (
      companyInfo.name.trim() === '' ||
      companyInfo.description.trim() === '' ||
      companyInfo.mission.trim() === ''
    ) {
      setIsInfoValid(false);
    } else {
      const detailResponse = await fetch("/api/AdminCompanyDetails/AddDetails", {
        method: "POST",
        body: JSON.stringify({companyInfo: companyInfo})
      })
      const result = await detailResponse.json()
      if (result.status === 201) {
        setIsInfoValid(true);
        setSubmittedInfo(companyInfo);
        setIsEditing(false);
      }
    }
  };



  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e, field, value) => {
    setCompanyInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value || e.target.value,
    }));
  };

  useEffect(() => {
    const fetchInformation = async () => {
      const fetchResponse = await fetch("/api/AdminCompanyDetails/FetchDetails")
      const fetchedData = await fetchResponse.json()
      if (fetchedData.status === 200) {
        setIsInfoValid(true)
        setSubmittedInfo(fetchedData.companyInfo)
        setCompanyInfo(fetchedData.companyInfo)
        setIsEditing(false);
        setIsLoading(false)
      } else {
        notify("Error : " + fetchedData.details, "error");
      }
    }
    fetchInformation()
  }, [])

  return (
    <>{
      isLodaing ? Loading() :
        <div className={styles.about_us
        } >
          {isEditing ? (
            <div>
              <label>
                Company Name:
                <input
                  type="text"
                  value={companyInfo.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                  placeholder="Enter company name"
                />
              </label>
              <br />
              <label>
                Company Description:
                <textarea
                  rows={4}
                  value={companyInfo.description}
                  onChange={(e) => handleInputChange(e, 'description')}
                  placeholder="Enter company description"
                ></textarea>
              </label>
              <label>
                Company Mission:
                <textarea
                  rows={4}
                  value={companyInfo.mission}
                  onChange={(e) => handleInputChange(e, 'mission')}
                  placeholder="Enter company mission"
                ></textarea>
              </label>
              <label>
                Core Values:
                <textarea
                  rows={4}
                  value={companyInfo.values.join('\n')}
                  onChange={(e) =>
                    handleInputChange(e, 'values', e.target.value.split('\n'))
                  }
                  placeholder="Enter core values (separated by new lines)"
                ></textarea>
              </label>
              <label>
                Product Categories:
                <textarea
                  rows={4}
                  value={companyInfo.productCategories.join('\n')}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      'productCategories',
                      e.target.value.split('\n')
                    )
                  }
                  placeholder="Enter product categories (separated by new lines)"
                ></textarea>
              </label>
              <label>
                Key Features:
                <textarea
                  rows={4}
                  value={companyInfo.keyFeatures.join('\n')}
                  onChange={(e) =>
                    handleInputChange(e, 'keyFeatures', e.target.value.split('\n'))
                  }
                  placeholder="Enter key features (separated by new lines)"
                ></textarea>
              </label>
              <br />
              <label>
                Global Reach:
                <input
                  type="text"
                  value={companyInfo.globalReach}
                  onChange={(e) => handleInputChange(e, 'globalReach')}
                  placeholder="Enter global reach"
                />
              </label>
              <br />
              <label>
                Headquarters:
                <input
                  type="text"
                  value={companyInfo.headquarters}
                  onChange={(e) => handleInputChange(e, 'headquarters')}
                  placeholder="Enter headquarters"
                />
              </label>
              <br />
              <label>
                Founder/CEO:
                <input
                  type="text"
                  value={companyInfo.founderCEO}
                  onChange={(e) => handleInputChange(e, 'founderCEO')}
                  placeholder="Enter founder/CEO name"
                />
              </label>
              <br />
              <label>
                History:
                <textarea
                  rows={4}
                  value={companyInfo.history}
                  onChange={(e) => handleInputChange(e, 'history')}
                  placeholder="Enter company history"
                ></textarea>
              </label>
              <label>
                Future Goals:
                <textarea
                  rows={4}
                  value={companyInfo.futureGoals}
                  onChange={(e) => handleInputChange(e, 'futureGoals')}
                  placeholder="Enter future goals"
                ></textarea>
              </label>

              <label>
                Contact Email:
                <input
                  type="email"
                  value={companyInfo.contact.email}
                  onChange={(e) => handleInputChange(e, 'contact', {...companyInfo.contact, email: e.target.value})}
                  placeholder="Enter contact email"
                />
              </label>
              <label>
                Contact Phone:
                <input
                  type="tel"
                  value={companyInfo.contact.phone}
                  onChange={(e) => handleInputChange(e, 'contact', {...companyInfo.contact, phone: e.target.value})}
                  placeholder="Enter contact phone"
                />
              </label>
              <label>
                Facebook Profile Link:
                <input
                  type="text"
                  value={companyInfo.contact.facebook}
                  onChange={(e) => handleInputChange(e, 'contact', {...companyInfo.contact, facebook: e.target.value})}
                  placeholder="Enter Facebook profile link"
                />
              </label>
              <label>
                Instagram Profile Link:
                <input
                  type="text"
                  value={companyInfo.contact.instagram}
                  onChange={(e) => handleInputChange(e, 'contact', {...companyInfo.contact, instagram: e.target.value})}
                  placeholder="Enter Instagram profile link"
                />
              </label>

              <center>
                <button onClick={handlePreview}>Save</button>
              </center>
              {!isInfoValid && (
                <p style={{color: 'red'}}>Required fields are empty.</p>
              )}
            </div>
          ) : (
            <div>
              {submittedInfo ? (
                <div>
                  <p><strong>Company Name:</strong> {submittedInfo.name}</p>
                  <p><strong>Company Description:</strong> {submittedInfo.description}</p>
                  <p><strong>Company Mission:</strong> {submittedInfo.mission}</p>
                  <p><strong>Core Values:</strong> {submittedInfo.values.join('\n')}</p>
                  <p><strong>Product Categories:</strong> {submittedInfo.productCategories.join('\n')}</p>
                  <p><strong>Key Features:</strong> {submittedInfo.keyFeatures.join('\n')}</p>
                  <p><strong>Contact Email:</strong> {submittedInfo.contact.email}</p>
                  <p><strong>Contact Phone:</strong> {submittedInfo.contact.phone}</p>
                  <p><strong>Facebook Profile Link:</strong> <Link href={submittedInfo.contact.facebook} >{submittedInfo.contact.facebook}</Link></p>
                  <p><strong>Instagram Profile Link:</strong> <Link href={submittedInfo.contact.instagram} >{submittedInfo.contact.instagram}</Link></p>
                  <p><strong>Global Reach:</strong> {submittedInfo.globalReach}</p>
                  <p><strong>Headquarters:</strong> {submittedInfo.headquarters}</p>
                  <p><strong>Founder/CEO:</strong> {submittedInfo.founderCEO}</p>
                  <p><strong>History:</strong> {submittedInfo.history}</p>
                  <p><strong>Future Goals:</strong> {submittedInfo.futureGoals}</p>
                  <center>
                    <button onClick={handleEdit}>Edit</button>
                  </center>
                </div>
              ) : (
                <div>
                  {/* Display input fields for company information */}
                  <label>Company Name: {companyInfo.name}</label>
                  <label>Company Description: {companyInfo.description}</label>
                  <label>Company Mission: {companyInfo.mission}</label>
                  <label>Core Values: {companyInfo.values.join('\n')}</label>
                  <label>Product Categories: {companyInfo.productCategories.join('\n')}</label>
                  <label>Key Features: {companyInfo.keyFeatures.join('\n')}</label>
                  <label>Contact Email: {companyInfo.contact.email}</label>
                  <label>Contact Phone: {companyInfo.contact.phone}</label>
                  <label>Facebook Profile Link: {companyInfo.contact.facebook}</label>
                  <label>Instagram Profile Link: {companyInfo.contact.instagram}</label>
                  <label>Global Reach: {companyInfo.globalReach}</label>
                  <label>Headquarters: {companyInfo.headquarters}</label>
                  <label>Founder/CEO: {companyInfo.founderCEO}</label>
                  <label>History: {companyInfo.history}</label>
                  <label>Future Goals: {companyInfo.futureGoals}</label>
                  <center>
                    <button onClick={handlePreview}>Submit</button>
                  </center>
                  {!isInfoValid && (
                    <p style={{color: 'red'}}>Required fields are empty.</p>
                  )}
                </div>
              )}
            </div>
          )}

        </div >
    }</>
  );
};

export default AboutUs;
